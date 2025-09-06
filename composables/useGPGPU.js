import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import gpgpuFragmentShader from '~/assets/shaders/gpgpu.glsl?raw'

export class GPGPU {
  constructor(renderer, scene) {
    this.scene = scene
    this.renderer = renderer

    this.params = {
      size: 4096,
    }

    this.size = Math.ceil(Math.sqrt(this.params.size))
    this.time = 0

    this.createGPGPURenderer()
    this.createDataTexture()
    this.createVariable()
    this.setRendererDependencies()
    this.initiateRenderer()
  }

  createGPGPURenderer() {
    this.gpgpuRenderer = new GPUComputationRenderer(
      this.size,
      this.size,
      this.renderer
    )
  }

  createDataTexture() {
    this.dataTexture = this.gpgpuRenderer.createTexture()
  }

  createVariable() {
    this.variable = this.gpgpuRenderer.addVariable('uGrid', gpgpuFragmentShader, this.dataTexture)
    this.variable.material.uniforms.uGridSize = new THREE.Uniform(this.size)
    this.variable.material.uniforms.uMouse = new THREE.Uniform(new THREE.Vector2(0, 0))
    this.variable.material.uniforms.uDeltaMouse = new THREE.Uniform(new THREE.Vector2(0, 0))
    this.variable.material.uniforms.uMouseMove = new THREE.Uniform(0)
  }

  setRendererDependencies() {
    this.gpgpuRenderer.setVariableDependencies(this.variable, [this.variable])
  }

  initiateRenderer() {
    this.gpgpuRenderer.init()
  }

  getTexture() {
    return this.gpgpuRenderer.getCurrentRenderTarget(this.variable).texture
  }

  updateMouse(uv) {
    this.variable.material.uniforms.uMouseMove.value = 1

    const current = this.variable.material.uniforms.uMouse.value.clone()
    const delta = uv.clone().sub(current).multiplyScalar(25)

    this.variable.material.uniforms.uDeltaMouse.value = delta
    this.variable.material.uniforms.uMouse.value = uv
  }

  stopMouseUpdates() {
    // Stop adding new displacement when mouse leaves
    this.variable.material.uniforms.uMouseMove.value = 0
  }

  render() {
    this.variable.material.uniforms.uMouseMove.value *= 0.98
    this.variable.material.uniforms.uDeltaMouse.value.multiplyScalar(0.98)

    this.gpgpuRenderer.compute()
  }
}
