import * as THREE from 'three'
import { GPGPU } from './useGPGPU.js'
import vertexShader from '~/assets/shaders/vertex.glsl?raw'
import fragmentShader from '~/assets/shaders/fragment.glsl?raw'

export const useDisplacementEffect = () => {
  let scene, camera, renderer, mesh, gpgpu, raycaster, mouse
  let animationId

  const init = (container, imageUrl) => {
    // Scene setup
    scene = new THREE.Scene()

    // Camera setup
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // GPGPU setup
    gpgpu = new GPGPU(renderer, scene)

    // Raycaster setup
    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    // Create geometry
    const geometry = new THREE.PlaneGeometry(2, 2)

    // Create material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: new THREE.Uniform(null),
        uContainerResolution: new THREE.Uniform(new THREE.Vector2(container.clientWidth, container.clientHeight)),
        uImageResolution: new THREE.Uniform(new THREE.Vector2()),
        uGrid: new THREE.Uniform(null),
      },
    })

    // Load texture
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(imageUrl, (texture) => {
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      material.uniforms.uTexture.value = texture
      material.uniforms.uImageResolution.value = new THREE.Vector2(texture.image.naturalWidth, texture.image.naturalHeight)
    })

    // Create mesh
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Mouse move handler
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      
      const intersects = raycaster.intersectObjects(scene.children)
      const target = intersects[0]
      
      if (target && target.uv) {
        gpgpu.updateMouse(target.uv)
      }
    }

    // Mouse leave handler to reset displacement
    const onMouseLeave = () => {
      // Stop adding new displacement and let existing displacement fade naturally
      gpgpu.stopMouseUpdates()
    }

    // Add event listeners to the container instead of window
    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)

    // Animation loop
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      gpgpu.render()
      material.uniforms.uGrid.value = gpgpu.getTexture()

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup function
    const cleanup = () => {
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (renderer) {
        renderer.dispose()
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
    }

    return { cleanup }
  }

  const resize = (container) => {
    if (renderer && camera) {
      renderer.setSize(container.clientWidth, container.clientHeight)
      camera.updateProjectionMatrix()

      if (mesh && mesh.material.uniforms.uContainerResolution) {
        mesh.material.uniforms.uContainerResolution.value = new THREE.Vector2(container.clientWidth, container.clientHeight)
      }
    }
  }

  return { init, resize }
}
