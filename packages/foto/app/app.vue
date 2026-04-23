<template>
  <div
    class="gallery"
    :class="{ galleryHasFilter: !!activeFilter?.tags?.length }"
    @click="onGalleryClick"
    @contextmenu.prevent
  >
    <div
      v-if="showSpinner"
      class="loadingScreen"
    >
      <svg
        class="spinner"
        viewBox="0 0 50 50"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-dasharray="100 25"
        />
      </svg>
    </div>

    <div
      v-if="!showSpinner && error"
      class="error"
    >
      Error loading photos: {{ error }}
    </div>

    <div
      v-else-if="!showSpinner && photos.length === 0"
      class="empty"
    >
      No photos yet. Share some from your iPhone!
    </div>

    <template v-else-if="!showSpinner">
      <PhotoGrid
        v-model:wiggle-mode="wiggleMode"
        :photos="visiblePhotos"
        @photo-click="openLightbox"
        @delete-request="promptDelete"
      />

      <Teleport to="body">
        <Transition name="lightbox">
          <div
            v-if="activePhoto && !wiggleMode"
            class="lightboxBackdrop"
            @click="closeLightbox"
          >
            <div class="lightboxStage">
              <div class="lightboxMedia">
                <img
                  :src="activePhoto.url"
                  :alt="activePhoto.filename"
                  class="lightboxImg"
                  :class="{ navBlur }"
                  decoding="async"
                />
              </div>

              <div
                class="lightboxMeta"
                :class="{ navBlur }"
                @click.stop
              >
                <p
                  v-if="activePhoto.caption"
                  class="metaCaption"
                >
                  {{ activePhoto.caption }}
                </p>
                <div
                  v-if="
                    activePhoto.takenAt ||
                    (activePhoto.tags && activePhoto.tags.length)
                  "
                  class="metaTags"
                >
                  <span
                    v-if="activePhoto.takenAt"
                    class="metaTag metaTagDate"
                    >{{ formatTakenAt(activePhoto.takenAt) }}</span
                  >
                  <span
                    v-for="tag in sortedTags"
                    :key="tag"
                    class="metaTag"
                    >{{ tag }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </template>

    <!-- Delete password modal -->
    <Teleport to="body">
      <div
        v-if="deleteTarget"
        class="modalBackdrop"
        @click.self="cancelDelete"
      >
        <div class="modal">
          <p class="modalTitle">Delete photo?</p>
          <input
            ref="passwordInput"
            v-model="deletePassword"
            type="password"
            class="modalInput"
            placeholder="Password"
            @keydown.enter="submitDelete"
            @keydown.esc="cancelDelete"
          />
          <p
            v-if="deleteError"
            class="modalError"
          >
            {{ deleteError }}
          </p>
          <div class="modalActions">
            <button
              type="button"
              class="modalCancel"
              @click="cancelDelete"
            >
              Cancel
            </button>
            <button
              type="button"
              class="modalConfirm"
              :disabled="deleteLoading"
              @click="submitDelete"
            >
              {{ deleteLoading ? '...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Contact modal -->
    <Teleport to="body">
      <div
        v-if="contactOpen"
        class="modalBackdrop"
        @click.self="closeContact"
      >
        <div class="modal">
          <p class="modalTitle">Get in touch</p>
          <template v-if="contactSent">
            <p class="modalSuccess">Thanks — message sent.</p>
            <div class="modalActions modalActionsSingle">
              <button
                type="button"
                class="modalSave"
                @click="closeContact"
              >
                Close
              </button>
            </div>
          </template>
          <template v-else>
            <input
              ref="contactEmailInput"
              v-model="contactEmail"
              type="email"
              required
              class="modalInput"
              placeholder="Your email"
              @keydown.esc="closeContact"
            />
            <textarea
              v-model="contactMessage"
              required
              rows="4"
              class="modalInput modalTextarea"
              placeholder="Message"
              @keydown.esc="closeContact"
            />
            <p
              v-if="contactError"
              class="modalError"
            >
              {{ contactError }}
            </p>
            <div class="modalActions">
              <button
                type="button"
                class="modalCancel"
                @click="closeContact"
              >
                Cancel
              </button>
              <button
                type="button"
                class="modalSave"
                :disabled="contactLoading"
                @click="submitContact"
              >
                {{ contactLoading ? '...' : 'Send' }}
              </button>
            </div>
          </template>
        </div>
      </div>
    </Teleport>

    <!-- Edit details modal -->
    <Teleport to="body">
      <div
        v-if="editingMeta"
        class="modalBackdrop"
        @click.self="cancelEdit"
      >
        <div class="modal">
          <p class="modalTitle">Edit details</p>
          <input
            ref="editCaptionInput"
            v-model="editCaption"
            type="text"
            class="modalInput"
            placeholder="Caption"
            @keydown.esc="cancelEdit"
          />
          <input
            v-model="editTagsRaw"
            type="text"
            class="modalInput"
            placeholder="Tags (comma-separated)"
            @keydown.esc="cancelEdit"
          />
          <input
            v-model="editTakenAt"
            type="date"
            class="modalInput"
            @keydown.esc="cancelEdit"
          />
          <input
            v-model="editPassword"
            type="password"
            class="modalInput"
            placeholder="Password"
            @keydown.enter="submitEdit"
            @keydown.esc="cancelEdit"
          />
          <p
            v-if="editError"
            class="modalError"
          >
            {{ editError }}
          </p>
          <div class="modalActions">
            <button
              type="button"
              class="modalCancel"
              @click="cancelEdit"
            >
              Cancel
            </button>
            <button
              type="button"
              class="modalSave"
              :disabled="editLoading"
              @click="submitEdit"
            >
              {{ editLoading ? '...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <header
      v-if="!showSpinner"
      ref="headerEl"
      :class="{ headerVisible }"
    >
      <h1>
        <Logotype /> is a small furniture studio in Atlanta, Georgia, building
        functional objects from sustainable materials since 2016. Contact
        <a
          class="ig"
          href="https://www.instagram.com/proportional.design"
          target="_blank"
        >
          @proportional.design
        </a>
        or
        <button
          type="button"
          class="aquaBtn"
          @click="openContact"
        >
          Get in touch
        </button>
      </h1>
    </header>

    <FilterIsland
      v-if="!showSpinner && photos.length"
      :messages="chatMessages"
      :active-filter="activeFilter"
      :available-tags="availableTags"
      :loading="chatLoading"
      @send="onSend"
      @remove-tag="onRemoveTag"
      @apply-tag="onApplyTag"
    />
  </div>
</template>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    height: 100vh;
    background: #0a0a0a;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0a0a0a;
    color: #fff;
    min-height: 100vh;
  }

  :focus {
    outline: none;
  }

  /* :focus-visible {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.88);
    border-radius: 4px;
  } */

  .gallery {
    max-width: 1400px;
    margin: 0 auto;
    @media (min-width: 640px) {
      margin-top: 40px;
      padding: 2rem 1rem;
    }
  }

  @media (max-width: 640px) {
    .gallery.galleryHasFilter {
      padding-top: 112px;
    }
  }

  header.headerVisible {
    opacity: 1;
    filter: blur(0);
  }

  header {
    opacity: 0;
    filter: blur(16px);
    transition:
      opacity 0.6s ease-out,
      filter 0.6s ease-out;
    margin: 4rem 0 6.4rem;
    /* margin-bottom: 6.4rem; */
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  header h1 {
    max-width: 800px;
    font-weight: 500;
    font-size: 1.8rem;
    line-height: 1.2;
    letter-spacing: -0.01em;
    text-align: center;
    /* text-align: justify; */
    /* transform: scale(0.8);
    transform-origin: left top; */
  }

  header p {
    color: #666;
    font-size: 0.875rem;
  }

  .ig {
    background: linear-gradient(
      45deg,
      #feda75 0%,
      #fa7e1e 25%,
      #d62976 50%,
      #962fbf 75%,
      #4f5bd5 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .aquaBtn {
    position: relative;
    appearance: none;
    border: 0;
    cursor: pointer;
    padding: 0.64rem 1.5rem;
    border-radius: 9999px;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.02em;
    border: 0.5px solid rgba(99, 99, 99, 0.6);
    transform: translateY(4px);
    background: linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 50%, #0f0f0f 100%);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.12) inset,
      0 -1px 0 rgba(0, 0, 0, 0.6) inset,
      0 0 0 1px rgba(0, 0, 0, 0.6),
      0 2px 4px rgba(0, 0, 0, 0.5),
      0 12px 32px rgba(0, 0, 0, 0.55);
    transition:
      transform 0.1s ease,
      filter 0.15s ease;

    @media (min-width: 640px) {
      transform: translateY(-3px) scale(0.96);
    }
  }

  .aquaBtn::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 6%;
    right: 6%;
    height: 48%;
    border-radius: 9999px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.22) 0%,
      rgba(255, 255, 255, 0.03) 100%
    );
    pointer-events: none;
  }

  .aquaBtn:hover {
    filter: brightness(1.1);
  }

  .aquaBtn:active {
    transform: translateY(1px);
    filter: brightness(0.95);
  }

  .error,
  .empty {
    text-align: center;
    padding: 4rem 1rem;
    color: #666;
  }

  .error {
    color: #ff6b6b;
  }

  .loadingScreen {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    background: #0a0a0a;
    z-index: 1500;
  }

  .spinner {
    width: 32px;
    height: 32px;
    color: #fff;
    animation: spin 0.9s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .lightboxBackdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(10px);
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: 18px;
  }

  .lightbox-enter-active,
  .lightbox-leave-active {
    transition:
      opacity 0.2s ease-in-out,
      backdrop-filter 0.2s ease-in-out;
  }

  .lightbox-enter-active .lightboxImg,
  .lightbox-leave-active .lightboxImg,
  .lightbox-enter-active .lightboxMeta,
  .lightbox-leave-active .lightboxMeta {
    transition:
      opacity 0.2s ease-in-out,
      filter 0.2s ease-in-out;
  }

  .lightbox-enter-from,
  .lightbox-leave-to {
    opacity: 0;
    backdrop-filter: blur(0px);
  }

  .lightbox-enter-from .lightboxImg,
  .lightbox-leave-to .lightboxImg,
  .lightbox-enter-from .lightboxMeta,
  .lightbox-leave-to .lightboxMeta {
    opacity: 0;
    filter: blur(20px);
  }

  .lightboxStage {
    position: relative;
    width: min(1100px, 100%);
    display: grid;
    place-items: center;
    pointer-events: none;
    overflow: visible;
  }

  .lightboxMedia {
    width: 100%;
    height: 100%;
    pointer-events: auto;
    display: grid;
    place-items: center;
    overflow: visible;
  }

  .lightboxImg {
    max-width: min(1100px, calc(100vw - 36px));
    max-height: calc(100dvh - 220px);
    box-shadow: 0 30px 100px rgba(0, 0, 0, 0.55);
    object-fit: contain;
    background: rgba(255, 255, 255, 0.04);
    pointer-events: none;
    transition: filter 260ms ease-out;
  }

  .lightboxImg.navBlur {
    filter: blur(20px);
    transition: none;
  }

  .lightboxMeta {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translate(-50%, 100%);
    width: min(420px, calc(100vw - 36px));
    padding: 0.75rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    pointer-events: auto;
    transition: filter 260ms ease-out;
  }

  .lightboxMeta.navBlur {
    filter: blur(10px);
    transition: none;
  }

  .metaCaption {
    font-weight: 500;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.85);
    text-align: center;
    line-height: 1.4;
    letter-spacing: 0.25px;
    text-transform: capitalize;
  }

  .metaTagDate {
    text-transform: none;
  }

  .metaTags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .metaTag {
    text-transform: capitalize;
    font-size: 13px;
    font-family: 'Georgia', 'Times New Roman', Times, serif;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.01em;
  }

  .metaTag:not(:last-child)::after {
    content: '•';
    margin: 0 4px;
    color: rgba(255, 255, 255, 0.35);
  }

  .ig {
    font-weight: 400;
    text-decoration: underline;
    text-decoration-color: rgba(255, 255, 255, 0.5);
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    text-decoration-style: dotted;
  }

  /* Delete modal */
  .modalBackdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(6px);
    z-index: 2000;
    display: grid;
    place-items: center;
    padding: 1rem;
  }

  .modal {
    background: #1c1c1e;
    /* border: 0.5px solid rgba(255, 255, 255, 0.1); */
    border-radius: 15px;
    padding: 1.5rem;
    width: min(500px, 100%);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .modalTitle {
    padding-bottom: 10px;
    font-size: 1rem;
    text-align: center;
  }

  .modalInput {
    border: none;
    border-radius: 8px;
    padding: 0.625rem 0.75rem;
    width: 100%;
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
    font-size: 1rem;
  }

  .modalInput::placeholder {
    color: #555;
  }

  .modalError {
    font-size: 0.8rem;
    color: #ff6b6b;
    text-align: center;
  }

  .modalSuccess {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.75);
    text-align: center;
    padding: 0.5rem 0 0.25rem;
  }

  .modalTextarea {
    resize: vertical;
    min-height: 96px;
    font-family: inherit;
    line-height: 1.4;
  }

  .modalActionsSingle {
    grid-template-columns: 1fr;
  }

  .modalActions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .modalCancel,
  .modalConfirm,
  .modalSave {
    border-radius: 8px;
    padding: 0.625rem 1.4rem;
    font-size: 0.9375rem;
    cursor: pointer;
    border: 0;
  }

  .modalCancel {
    background: none;
    color: #fff;
  }

  .modalConfirm {
    background: #ff3b30;
    color: #fff;
    font-weight: 500;
  }

  .modalSave {
    background: #fff;
    color: #000;
    font-weight: 500;
  }

  .modalConfirm:disabled,
  .modalSave:disabled {
    opacity: 0.5;
    cursor: default;
  }

  @media (max-width: 640px) {
    header h1 {
      font-size: 2rem;
    }

    header {
      margin: 2rem 0 0;
      padding: 0 1rem calc(1rem + env(safe-area-inset-bottom));
    }

    .lightboxStage {
      width: min(1100px, 100%);
    }
  }
</style>

<script setup>
  const { data, pending, error } = await useFetch('/api/photos')

  const photos = computed(() => data.value?.photos || [])

  const pageLoaded = ref(false)
  onMounted(() => {
    if (document.readyState === 'complete') {
      pageLoaded.value = true
      return
    }
    window.addEventListener(
      'load',
      () => {
        pageLoaded.value = true
      },
      { once: true },
    )
  })

  const showSpinner = computed(() => pending.value || !pageLoaded.value)

  // Chat / filter island
  const chatMessages = ref([])
  const activeFilter = ref(null) // { tags: [{ label, filenames: Set }] } | null
  const chatLoading = ref(false)

  const visiblePhotos = computed(() => {
    const tags = activeFilter.value?.tags
    if (!tags?.length) return photos.value
    const union = new Set()
    for (const t of tags) for (const f of t.filenames) union.add(f)
    return photos.value.filter((p) => union.has(p.filename))
  })

  watch(
    activeFilter,
    () => {
      if (typeof window === 'undefined') return
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    { flush: 'post' },
  )

  async function onSend(text) {
    chatMessages.value.push({ role: 'user', content: text })
    chatLoading.value = true
    try {
      const res = await $fetch('/api/chat', {
        method: 'POST',
        body: {
          messages: chatMessages.value,
          activeTags: (activeFilter.value?.tags || []).map((t) => t.label),
        },
      })
      if (!res.success) {
        chatMessages.value.push({
          role: 'assistant',
          content: res.error || 'Something went wrong.',
        })
        return
      }
      chatMessages.value.push({
        role: 'assistant',
        content: res.reply || '',
      })
      if (res.clearFilter) {
        activeFilter.value = null
      }
      if (res.filter?.tags?.length) {
        activeFilter.value = {
          tags: res.filter.tags.map((t) => ({
            label: t.label,
            filenames: new Set(t.filenames),
          })),
        }
      }
    } catch {
      chatMessages.value.push({
        role: 'assistant',
        content: 'Something went wrong.',
      })
    } finally {
      chatLoading.value = false
    }
  }

  function onRemoveTag(label) {
    const tags = activeFilter.value?.tags || []
    const next = tags.filter((t) => t.label !== label)
    activeFilter.value = next.length ? { tags: next } : null
  }

  const availableTags = computed(() => {
    const map = new Map()
    for (const p of photos.value) {
      for (const raw of p.tags || []) {
        const label = String(raw).trim().toLowerCase()
        if (!label) continue
        if (!map.has(label)) map.set(label, new Set())
        map.get(label).add(p.filename)
      }
    }
    return [...map.entries()]
      .map(([label, filenames]) => ({ label, filenames: [...filenames] }))
      .sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }),
      )
  })

  function onApplyTag({ label, filenames }) {
    const current = activeFilter.value?.tags || []
    if (current.some((t) => t.label === label)) return
    activeFilter.value = {
      tags: [...current, { label, filenames: new Set(filenames) }],
    }
  }

  // Lightbox
  const activeIndex = ref(-1)
  const activePhoto = computed(() => {
    if (activeIndex.value < 0) return null
    return visiblePhotos.value[activeIndex.value] || null
  })

  const sortedTags = computed(() => {
    const tags = activePhoto.value?.tags
    if (!tags?.length) return []
    return [...tags].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' }),
    )
  })

  function openLightbox(photo) {
    const idx = visiblePhotos.value.findIndex((p) => p.url === photo.url)
    activeIndex.value = idx >= 0 ? idx : 0
  }

  function closeLightbox() {
    activeIndex.value = -1
  }

  const navBlur = ref(false)

  function triggerNavBlur() {
    navBlur.value = true
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        navBlur.value = false
      })
    })
  }

  function goNext() {
    if (!visiblePhotos.value.length) return
    triggerNavBlur()
    activeIndex.value = (activeIndex.value + 1) % visiblePhotos.value.length
  }

  function goPrev() {
    if (!visiblePhotos.value.length) return
    triggerNavBlur()
    activeIndex.value =
      (activeIndex.value - 1 + visiblePhotos.value.length) %
      visiblePhotos.value.length
  }

  function formatTakenAt(iso) {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
      })
    } catch {
      return ''
    }
  }

  watch(activePhoto, (next) => {
    if (!process.client) return
    document.body.style.overflow = next ? 'hidden' : ''
    editingMeta.value = false
  })

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      if (contactOpen.value) {
        closeContact()
        return
      }
      if (deleteTarget.value) {
        cancelDelete()
        return
      }
      if (editingMeta.value) {
        cancelEdit()
        return
      }
      if (activePhoto.value) {
        closeLightbox()
        return
      }
      if (wiggleMode.value) {
        exitWiggle()
        return
      }
    }
    if (!activePhoto.value) return
    if (editingMeta.value) return
    if (e.key === 'ArrowRight') goNext()
    if (e.key === 'ArrowLeft') goPrev()
    if (e.key === '?') {
      e.preventDefault()
      startEdit()
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))

  // Header scroll-in transition
  const headerEl = ref(null)
  const headerVisible = ref(false)
  let headerObserver = null

  watch(headerEl, (el) => {
    if (headerObserver) {
      headerObserver.disconnect()
      headerObserver = null
    }
    if (!el) return
    headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) headerVisible.value = true
      },
      { threshold: 0.2 },
    )
    headerObserver.observe(el)
  })

  onBeforeUnmount(() => headerObserver?.disconnect())

  // Wiggle / delete mode
  const wiggleMode = ref(false)

  function exitWiggle() {
    wiggleMode.value = false
  }

  function onGalleryClick(e) {
    if (!wiggleMode.value) return
    if (!e.target.closest('.photoWrap')) exitWiggle()
  }

  // Delete flow
  const deleteTarget = ref(null)
  const deletePassword = ref('')
  const deleteError = ref('')
  const deleteLoading = ref(false)
  const passwordInput = ref(null)

  function promptDelete(photo) {
    deleteTarget.value = photo
    deletePassword.value = ''
    deleteError.value = ''
    nextTick(() => passwordInput.value?.focus())
  }

  function cancelDelete() {
    deleteTarget.value = null
    deletePassword.value = ''
    deleteError.value = ''
  }

  // Contact form
  const contactOpen = ref(false)
  const contactEmail = ref('')
  const contactMessage = ref('')
  const contactError = ref('')
  const contactLoading = ref(false)
  const contactSent = ref(false)
  const contactEmailInput = ref(null)

  function openContact() {
    contactOpen.value = true
    contactSent.value = false
    contactError.value = ''
    nextTick(() => contactEmailInput.value?.focus())
  }

  function closeContact() {
    contactOpen.value = false
    contactError.value = ''
  }

  async function submitContact() {
    const email = contactEmail.value.trim()
    const message = contactMessage.value.trim()
    if (!email || !message) {
      contactError.value = 'Email and message are required.'
      return
    }
    contactLoading.value = true
    contactError.value = ''
    try {
      const res = await fetch('https://formspree.io/f/mojyyvql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, message }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        contactError.value =
          data?.errors?.[0]?.message ||
          'Something went wrong. Please try again.'
        return
      }
      contactSent.value = true
      contactEmail.value = ''
      contactMessage.value = ''
    } catch {
      contactError.value = 'Something went wrong. Please try again.'
    } finally {
      contactLoading.value = false
    }
  }

  // Edit metadata flow
  const editingMeta = ref(false)
  const editCaption = ref('')
  const editTagsRaw = ref('')
  const editTakenAt = ref('')
  const editPassword = ref('')
  const editError = ref('')
  const editLoading = ref(false)

  const editCaptionInput = ref(null)

  function startEdit() {
    if (!activePhoto.value) return
    editCaption.value = activePhoto.value.caption || ''
    editTagsRaw.value = (activePhoto.value.tags || []).join(', ')
    editTakenAt.value = activePhoto.value.takenAt
      ? activePhoto.value.takenAt.slice(0, 10)
      : ''
    editPassword.value = ''
    editError.value = ''
    editingMeta.value = true
    nextTick(() => editCaptionInput.value?.focus())
  }

  function cancelEdit() {
    editingMeta.value = false
    editError.value = ''
  }

  async function submitEdit() {
    if (!editPassword.value || !activePhoto.value) return
    editLoading.value = true
    editError.value = ''

    const photo = activePhoto.value
    const caption = editCaption.value
    const tags = editTagsRaw.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const takenAt = editTakenAt.value
      ? new Date(editTakenAt.value).toISOString()
      : ''

    try {
      const res = await $fetch('/api/update-photo', {
        method: 'PATCH',
        body: {
          publicId: photo.filename,
          caption,
          tags,
          takenAt,
          password: editPassword.value,
        },
      })
      if (!res.success) {
        editError.value = res.error || 'Incorrect password'
      } else {
        data.value = {
          ...data.value,
          photos: data.value.photos.map((p) =>
            p.filename === photo.filename
              ? { ...p, caption, tags, takenAt: takenAt || p.uploadedAt }
              : p,
          ),
        }
        editingMeta.value = false
      }
    } catch {
      editError.value = 'Something went wrong'
    } finally {
      editLoading.value = false
    }
  }

  async function submitDelete() {
    if (!deletePassword.value) return
    deleteLoading.value = true
    deleteError.value = ''

    const target = deleteTarget.value
    const password = deletePassword.value
    const snapshot = data.value

    data.value = {
      ...data.value,
      photos: data.value.photos.filter((p) => p.filename !== target.filename),
    }
    cancelDelete()
    if (!photos.value.length) exitWiggle()

    try {
      const res = await $fetch('/api/delete-photo', {
        method: 'DELETE',
        body: { publicId: target.filename, password },
      })
      if (!res.success) {
        data.value = snapshot
        deleteTarget.value = target
        deleteError.value = res.error || 'Incorrect password'
      }
    } catch {
      deleteError.value = 'Something went wrong'
    } finally {
      deleteLoading.value = false
    }
  }
</script>
