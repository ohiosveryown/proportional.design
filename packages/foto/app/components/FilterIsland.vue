<template>
  <div
    class="filterIsland"
    :class="{ isCollapsed: collapsed, isWide }"
  >
    <div
      class="expandoWrap"
      :class="{ isOpen: expandoOpen }"
    >
      <div class="expandoClip">
        <div
          class="expando"
          :class="{ isOpen: expandoOpen }"
        >
          <div class="chevron">
            <button
              type="button"
              class="chevronBtn"
              aria-label="Collapse"
              @click="collapse"
            >
              <IconChevronShallow />
            </button>
          </div>
          <div
            v-if="hasHistory"
            ref="historyEl"
            class="history"
          >
            <div
              v-for="(m, i) in messages"
              :key="i"
              class="turn turnEnter"
              :class="`turn--${m.role}`"
            >
              {{ m.content }}
            </div>
            <div
              v-if="loading"
              class="turn turn--assistant turn--loading turnEnter"
            >
              <span class="dot" />
              <span class="dot" />
              <span class="dot" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="menuWrap"
      :class="{ isOpen: menuOpen }"
    >
      <div class="menuClip">
        <div
          class="menu"
          :class="{ isOpen: menuOpen }"
        >
          <div
            v-if="menuTags.length"
            class="menuTags"
          >
            <button
              v-for="t in menuTags"
              :key="t.label"
              type="button"
              class="menuTag"
              @click="selectTag(t)"
            >
              {{ t.label }}
            </button>
          </div>
          <div
            v-else
            class="menuEmpty"
          >
            No more filters available.
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="activeFilter?.tags?.length"
      class="chipRow"
    >
      <button
        v-for="t in activeFilter.tags"
        :key="t.label"
        type="button"
        class="filterChip"
        @click="$emit('removeTag', t.label)"
      >
        <span>{{ t.label }}</span>
        <span
          class="chipX"
          aria-hidden="true"
          >×</span
        >
      </button>
    </div>

    <form
      class="inputRow"
      @submit.prevent="onSubmit"
    >
      <a
        href="https://www.instagram.com/proportional.design"
        target="_blank"
        rel="noopener"
        class="avatar"
        aria-label="Instagram"
      />
      <div class="inputWrap">
        <Transition :name="placeholderTransitionName">
          <span
            v-if="showRotatingPlaceholder"
            :key="placeholderText"
            class="rotatingPlaceholder"
            aria-hidden="true"
          >
            {{ placeholderText }}
          </span>
        </Transition>
        <input
          v-model="draft"
          type="text"
          class="filterInput"
          placeholder=""
          :disabled="loading"
          @focus="onInputFocus"
          @blur="onInputBlur"
          @click="onInputFocus"
          @keydown.esc="$event.target.blur()"
        />
      </div>
      <button
        type="button"
        class="filterBtn"
        :class="{ isActive: menuOpen }"
        :aria-expanded="menuOpen"
        aria-label="Filters"
        @click="toggleMenu"
      >
        <IconFilter />
      </button>
    </form>
  </div>
</template>

<script setup>
  const props = defineProps({
    messages: { type: Array, default: () => [] },
    activeFilter: { type: Object, default: null },
    availableTags: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  })
  const emit = defineEmits(['send', 'removeTag', 'applyTag'])

  const draft = ref('')
  const historyEl = ref(null)
  const collapsed = ref(false)
  const focused = ref(false)
  const menuOpen = ref(false)
  const placeholderIndex = ref(0)
  const reduceMotion = ref(false)
  let placeholderTimer = null

  const hasHistory = computed(() => props.messages.length > 0 || props.loading)
  const hasFilter = computed(() => !!props.activeFilter?.tags?.length)
  const isWide = computed(
    () =>
      hasFilter.value ||
      menuOpen.value ||
      (!collapsed.value && (focused.value || hasHistory.value)),
  )
  const expandoOpen = computed(() => !collapsed.value && hasHistory.value)

  const menuTags = computed(() => {
    const active = new Set((props.activeFilter?.tags || []).map((t) => t.label))
    return props.availableTags.filter((t) => !active.has(t.label))
  })

  const placeholderOptions = computed(() => {
    const placeholderCycle = {
      default: 'Search or filter…',
      cycleOne: 'Show me just chairs...',
      cycleThree: 'Try “joinery”...',
      cycleTwo: 'Show me only walnut...',
      cycleFour: 'Who run this place?',
    }
    return Object.values(placeholderCycle).filter(Boolean)
  })

  const showRotatingPlaceholder = computed(() => {
    if (props.loading) return false
    if (focused.value) return false
    if (draft.value.trim().length) return false
    return placeholderOptions.value.length > 0
  })

  const placeholderTransitionName = computed(() =>
    reduceMotion.value ? '' : 'ph',
  )

  const placeholderText = computed(() => {
    const opts = placeholderOptions.value
    if (!opts.length) return ''
    const idx =
      ((placeholderIndex.value % opts.length) + opts.length) % opts.length
    return opts[idx]
  })

  function onSubmit() {
    const text = draft.value.trim()
    if (!text || props.loading) return
    emit('send', text)
    draft.value = ''
    menuOpen.value = false
  }

  function collapse() {
    collapsed.value = true
  }

  function onInputFocus() {
    focused.value = true
    if (collapsed.value && hasHistory.value) collapsed.value = false
  }

  function onInputBlur() {
    focused.value = false
  }

  function toggleMenu() {
    menuOpen.value = !menuOpen.value
  }

  function selectTag(tag) {
    emit('applyTag', { label: tag.label, filenames: tag.filenames })
    menuOpen.value = false
  }

  function stopPlaceholderTimer() {
    if (placeholderTimer) clearInterval(placeholderTimer)
    placeholderTimer = null
  }

  function startPlaceholderTimer() {
    stopPlaceholderTimer()
    if (!showRotatingPlaceholder.value) return
    if (reduceMotion.value) return
    placeholderTimer = setInterval(() => {
      if (!showRotatingPlaceholder.value) return
      placeholderIndex.value += 1
    }, 3200)
  }

  onMounted(() => {
    try {
      reduceMotion.value =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    } catch {
      reduceMotion.value = false
    }
    startPlaceholderTimer()
  })

  onBeforeUnmount(() => stopPlaceholderTimer())

  watch(
    () => showRotatingPlaceholder.value,
    () => startPlaceholderTimer(),
  )

  watch(
    () => placeholderOptions.value.length,
    () => {
      placeholderIndex.value = 0
      startPlaceholderTimer()
    },
  )

  watch(
    () => [props.messages.length, props.loading],
    async ([len], [prevLen]) => {
      if (len > prevLen) collapsed.value = false
      await nextTick()
      const el = historyEl.value
      if (el) el.scrollTop = el.scrollHeight
    },
  )
</script>

<style scoped>
  .filterIsland {
    position: fixed;
    top: max(8px, env(safe-area-inset-top));
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 500;
    width: min(262px, calc(100vw - 32px));
    display: flex;
    flex-direction: column;
    border-radius: 24px;
    background: rgba(0, 0, 0, 0.32);
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    box-shadow: 0 0.5px 0 0 rgba(255, 255, 255, 0.4) inset;
    transition: width 0.3s ease;
    @media (min-width: 640px) {
      width: min(248px, calc(100vw - 32px));
      top: auto;
      bottom: 24px;
      box-shadow:
        0 10px 40px 0 rgba(0, 0, 0, 0.45),
        0 0.5px 0 0 rgba(255, 255, 255, 0.4) inset;
    }
  }

  .filterIsland.isWide {
    width: min(360px, calc(100vw - 32px));
  }

  .expandoWrap {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.2s ease;
  }

  .expandoWrap.isOpen {
    grid-template-rows: 1fr;
  }

  .expandoClip {
    overflow: hidden;
    min-height: 0;
  }

  .expando {
    display: flex;
    flex-direction: column;
    opacity: 0;
    filter: blur(20px);
    transform: scale(0.9);
    transition:
      opacity 0.2s ease,
      filter 0.2s ease,
      transform 0.2s ease;
  }

  .expando.isOpen {
    opacity: 1;
    filter: blur(0px);
    transform: scale(1);
    transition-delay: 0.15s;
  }

  @keyframes turnEnter {
    from {
      opacity: 0;
      filter: blur(8px);
    }
    to {
      opacity: 1;
      filter: blur(0px);
    }
  }

  .turnEnter {
    animation: turnEnter 0.35s ease-out both;
  }

  .chevron {
    display: flex;
    justify-content: center;
    padding-top: 10px;
  }

  .chevronBtn {
    appearance: none;
    border: 0;
    background: transparent;
    padding: 6px 18px;
    cursor: pointer;
    display: grid;
    place-items: center;
    border-radius: 999px;
    transition: background 0.15s ease;
  }

  .chevronBtn:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .chevronBtn svg {
    transform: scale(1.5);
  }

  .history {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 40vh;
    overflow-y: auto;
    padding: 20px 14px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
    mask-image: linear-gradient(
      to bottom,
      transparent 0,
      #000 24px,
      #000 calc(100% - 24px),
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0,
      #000 24px,
      #000 calc(100% - 24px),
      transparent 100%
    );
  }

  .history::-webkit-scrollbar {
    width: 4px;
  }

  .history::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 4px;
  }

  .turn {
    font-size: 15px;
    line-height: 1.4;
  }

  .turn--user {
    align-self: flex-end;
    max-width: 80%;
    padding: 7px 14px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.88);
  }

  .turn--user + .turn--assistant {
    margin-top: -4px;
  }

  .turn--assistant + .turn--user {
    margin-top: 8px;
  }

  .turn--assistant {
    text-align: left;
    color: #fff;
  }

  .turn--loading {
    display: inline-flex;
    gap: 5px;
    padding: 4px 0;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    animation: blink 1.2s infinite ease-in-out;
  }

  .dot:nth-child(2) {
    animation-delay: 0.15s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes blink {
    0%,
    80%,
    100% {
      opacity: 0.25;
    }
    40% {
      opacity: 1;
    }
  }

  .menuWrap {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.2s ease;
  }

  .menuWrap.isOpen {
    grid-template-rows: 1fr;
  }

  .menuClip {
    overflow: hidden;
    min-height: 0;
  }

  .menu {
    padding: 14px 12px 6px;
    opacity: 0;
    filter: blur(12px);
    transform: scale(0.96);
    transition:
      opacity 0.2s ease,
      filter 0.2s ease,
      transform 0.2s ease;
  }

  .menu.isOpen {
    opacity: 1;
    filter: blur(0px);
    transform: scale(1);
    transition-delay: 0.1s;
  }

  .menuTags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    max-height: 40vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
  }

  .menuTag {
    appearance: none;
    border: 0;
    cursor: pointer;
    padding: 5px 12px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    font-family: inherit;
    font-size: 12px;
    letter-spacing: 0.01em;
    text-transform: capitalize;
    opacity: 0;
    filter: blur(8px);
    transition:
      background 0.15s ease,
      opacity 0.25s ease,
      filter 0.25s ease;
  }

  .menu.isOpen .menuTag,
  .menu.isOpen .menuEmpty {
    opacity: 1;
    filter: blur(0px);
    transition-delay: 0.24s;
  }

  .menuTag:hover {
    background: rgba(255, 255, 255, 0.18);
  }

  .menuEmpty {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
    padding: 4px 0;
    opacity: 0;
    filter: blur(8px);
    transition:
      opacity 0.25s ease,
      filter 0.25s ease;
  }

  .chipRow {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 14px 10px 2px;
  }

  .chipRow::before {
    content: '';
    position: absolute;
    top: 0;
    left: 12px;
    right: 12px;
    height: 1px;
    background: rgba(255, 255, 255, 0.12);
  }

  .isCollapsed .chipRow {
    padding-top: 12px;
  }

  .isCollapsed .chipRow::before {
    display: none;
  }

  .filterChip {
    appearance: none;
    border: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px 5px 12px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    font-family: inherit;
    font-size: 12px;
    letter-spacing: 0.01em;
    transition: background 0.15s ease;
  }

  .filterChip:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .chipX {
    font-size: 14px;
    line-height: 1;
    opacity: 0.7;
  }

  .inputRow {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px 4px 9px;
  }

  .inputWrap {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  .avatar {
    display: block;
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: url('/android-chrome-192x192.png') no-repeat center center;
    background-size: contain;
    box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.4) inset;
    cursor: pointer;
    position: relative;
  }

  @media (hover: hover) and (pointer: fine) {
    .avatar::after {
      content: 'Instagram';
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%) translateY(4px);
      padding: 6px 8px 6px 9px;
      border-radius: 9px;
      background: rgba(0, 0, 0, 1);
      color: rgba(255, 255, 255, 0.88);
      box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.4) inset;
      font-size: 13px;
      line-height: 1;
      white-space: nowrap;
      pointer-events: none;
      will-change: opacity, transform;
      opacity: 0;
      filter: blur(5px);
      transition:
        opacity 0.15s ease,
        filter 0.15s ease,
        transform 0.01s ease 0.15s;
    }

    .avatar:hover::after {
      opacity: 1;
      filter: blur(0px);
      transform: translateX(-50%) translateY(2px);
      transition:
        opacity 0.3s ease 0.15s,
        filter 0.3s ease 0.15s,
        transform 0.3s ease 0.15s;
    }
  }

  .filterInput {
    width: 100%;
    background: transparent;
    border: 0;
    color: #fff;
    font-size: 16px;
    padding: 10px 0;
    font-family: inherit;
    transform: scale(0.94);
    transform-origin: left center;
    @media (min-width: 640px) {
      font-size: 14px;
      transform: scale(1);
    }
  }

  .rotatingPlaceholder {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%) scale(0.94);
    transform-origin: left center;
    color: rgba(255, 255, 255, 0.75);
    pointer-events: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    @media (min-width: 640px) {
      transform: translateY(-50%) scale(1);
      font-size: 14px;
    }
  }

  .ph-enter-active,
  .ph-leave-active {
    transition:
      opacity 800ms ease,
      transform 800ms ease,
      filter 800ms ease;
  }

  .ph-enter-from {
    opacity: 0;
    filter: blur(20px);
    transform: translateY(calc(-50% + 12px)) scale(0.94);
    @media (min-width: 640px) {
      transform: translateY(calc(-50% + 12px)) scale(1);
    }
  }

  .ph-leave-to {
    opacity: 0;
    filter: blur(20px);
    transform: translateY(calc(-50% - 12px)) scale(0.94);
    @media (min-width: 640px) {
      transform: translateY(calc(-50% - 12px)) scale(1);
    }
  }

  .filterInput:disabled {
    opacity: 0.6;
  }

  .filterBtn {
    appearance: none;
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 8px;
    border-radius: 9999px;
    display: grid;
    place-items: center;
    color: #fff;
    transition: background 0.15s ease;
  }

  .filterBtn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
  }

  .filterBtn.isActive {
    background: rgba(255, 255, 255, 0.16);
  }

  .filterBtn:disabled {
    opacity: 0.4;
    cursor: default;
  }
</style>
