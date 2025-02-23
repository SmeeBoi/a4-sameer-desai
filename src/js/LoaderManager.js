import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextureLoader } from 'three'
import { AudioLoader } from 'three'

class LoaderManager {
  #assets
  #textureLoader = new TextureLoader()
  #GLTFLoader = new GLTFLoader()
  #OBJLoader = new OBJLoader()
  #DRACOLoader = new DRACOLoader()
  #FontLoader = new FontLoader()
  #AudioLoader = new AudioLoader()

  constructor() {
    this.#assets = {} // Dictionary of assets, can be different type, gltf, texture, img, font, feel free to make a Enum if using TypeScript
  }

  get assets() {
    return this.#assets
  }

  set assets(value) {
    this.#assets = value
  }

  /**
   * Public method
   */

  get(name) {
    return this.#assets[name]
  }

  load = (data) =>
    new Promise((resolve) => {
      const promises = []
      for (let i = 0; i < data.length; i++) {
        const { name, gltf, texture, img, font, obj, audio } = data[i]

        if (!this.#assets[name]) {
          this.#assets[name] = {}
        }

        if (gltf) {
          promises.push(this.loadGLTF(gltf, name))
        }

        if (texture) {
          promises.push(this.loadTexture(texture, name))
        }

        if (img) {
          promises.push(this.loadImage(img, name))
        }

        if (font) {
          promises.push(this.loadFont(font, name))
        }

        if (obj) {
          promises.push(this.loadObj(obj, name))
        }

        if (audio) {
          promises.push(this.loadAudio(audio, name))
        }
      }

      Promise.all(promises).then(() => resolve())
    })

  loadGLTF(url, name) {
    return new Promise((resolve) => {
      this.#DRACOLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
      this.#GLTFLoader.setDRACOLoader(this.#DRACOLoader)

      this.#GLTFLoader.load(
        url,
        (result) => {
          this.#assets[name].gltf = result
          resolve(result)
        },
        undefined,
        (e) => {
          console.log(e)
        }
      )
    })
  }

  loadTexture(url, name) {
    if (!this.#assets[name]) {
      this.#assets[name] = {}
    }
    return new Promise((resolve) => {
      this.#textureLoader.load(url, (result) => {
        this.#assets[name].texture = result
        resolve(result)
      })
    })
  }

  loadImage(url, name) {
    return new Promise((resolve) => {
      const image = new Image()

      image.onload = () => {
        this.#assets[name].img = image
        resolve(image)
      }

      image.src = url
    })
  }

  loadFont(url, name) {
    // you can convert font to typeface.json using https://gero3.github.io/facetype.js/
    return new Promise((resolve) => {
      this.#FontLoader.load(
        url,

        // onLoad callback
        (font) => {
          this.#assets[name].font = font
          resolve(font)
        },

        // onProgress callback
        () =>
          // xhr
          {
            // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
          },

        // onError callback
        (err) => {
          console.log('An error happened', err)
        }
      )
    })
  }

  // https://threejs.org/docs/#examples/en/loaders/OBJLoader
  loadObj(url, name) {
    return new Promise((resolve) => {
      // load a resource
      this.#OBJLoader.load(
        // resource URL
        url,
        // called when resource is loaded
        (object) => {
          this.#assets[name].obj = object
          resolve(object)
        },
        // onProgress callback
        () =>
          // xhr
          {
            // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
          },
        // called when loading has errors
        (err) => {
          console.log('An error happened', err)
        }
      )
    })
  }

  //loadAudio
  loadAudio(url, name) {
    return new Promise((resolve) => {
      this.#AudioLoader.load(
        url,
        (audioBuffer) => {
          this.#assets[name].buffer = audioBuffer
          resolve(audioBuffer)
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (err) => {
          console.log('An error happened', err)
        }
      )
    })
  }





}

export default new LoaderManager()
