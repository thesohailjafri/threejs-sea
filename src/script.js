import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import testVertexShader from './shaders/sea/vertex.glsl'
import testFragmentShader from './shaders/sea/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObj = {
    surfaceColor: '#87CEFA',
    deepColor: '#006994',
}
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneBufferGeometry(window.innerWidth * 0.008, 5, 512, 512)

// const testmesh = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(testmesh)

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0.0 },
        uSpeed: { value: 0.75 },

        uWaveElevation: { value: 0.1 },
        uWaveFrequency: { value: new THREE.Vector2(4.0, 1.5) },

        uSurfaceColor: {
            value: new THREE.Color(debugObj.surfaceColor)
        },
        uDeepColor: {
            value: new THREE.Color(debugObj.deepColor),
        },

        uColorMultiplier: { value: 5.0 },
        uColorOffset: { value: 0.08 },


        uMicroWaveElevation: { value: 0.15 },
        uMicroWaveFrequency: { value: 3.0 },
        uMicroWaveSpeed: { value: 0.2 },
        uMicroWaveIteration: { value: 3.0 },
    },
})

/* Debug */
const bigWave = gui.addFolder('Control Big Wave')
const smallWave = gui.addFolder('Control Small Wave')


bigWave.add(material.uniforms.uSpeed, 'value', 0, 2, 0.001).name('Speed')

bigWave.add(material.uniforms.uWaveElevation, 'value', 0, 1, 0.001).name('Elevation')

bigWave.add(material.uniforms.uWaveFrequency.value, 'x', 0, 10, 0.001).name('Frequency X')
bigWave.add(material.uniforms.uWaveFrequency.value, 'y', 0, 10, 0.001).name('Frequency Y')

bigWave.addColor(debugObj, 'surfaceColor').onChange(() => material.uniforms.uSurfaceColor.value.set(debugObj.surfaceColor))
bigWave.addColor(debugObj, 'deepColor').onChange(() => material.uniforms.uDeepColor.value.set(debugObj.deepColor))

bigWave.add(material.uniforms.uColorMultiplier, 'value', 0, 10, 0.001).name('Colors intensity')
bigWave.add(material.uniforms.uColorOffset, 'value', 0, 2, 0.001).name('Color offset')

smallWave.add(material.uniforms.uMicroWaveElevation, 'value', 0, 1, 0.001).name('Elevation')
smallWave.add(material.uniforms.uMicroWaveFrequency, 'value', 0, 10, 0.001).name('Frequency')
smallWave.add(material.uniforms.uMicroWaveSpeed, 'value', 0, 1, 0.001).name('Speed')
smallWave.add(material.uniforms.uMicroWaveIteration, 'value', 0, 10, 0.001).name('Iteration')

// Mesh
const water = new THREE.Mesh(geometry, material)
water.rotation.x = Math.PI * 0.5

scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0.5, 3)
// camera.lookAt(water)
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor(debugObj.deepColor)
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {

    let timePassed = clock.getElapsedTime()

    material.uniforms.uTime.value = timePassed

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()