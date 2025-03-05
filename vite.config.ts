import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'
import { loadEnv } from 'vite'
import veauryVitePlugins from 'veaury/vite/index.js'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // console.log('mode', mode)

  const getBuildCfg = () => {
    if (mode === 'production') {
      return {
        lib: {
          formats: ['es'],
        },
        outDir: 'esm',
        rollupOptions: {
          output: {
            manualChunks(id: string) {
              const tinymceReg =
                /@?tinymce\/(tinymce\-vue|tinymce|plugins|themes|icons|models)\/?.+/i
              if (tinymceReg.test(id)) {
                return 'tinymce'
              }
            },
          },
        },
      }
    }
    return {
      lib: {
        formats: ['umd'],
      },
      outDir: 'lib',
      rollupOptions: {
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
            react: 'React',
            // tinymce: 'tinymce',
            // 'tinymce/tinymce': 'tinymce',
          },
        },
      },
    }
  }
  const buildCfg = getBuildCfg()
  console.log('cfg', buildCfg)
  console.log('hostname:', env.VITE_HOSTNAME)
  return {
    // base: "./",
    base: '/',
    plugins: [
      // react({
      //   babel: {
      //     plugins: [
      //       ['@babel/plugin-proposal-decorators', { legacy: true }],
      //       ['@babel/plugin-proposal-class-properties', { loose: true }],
      //     ],
      //   },
      // }),
      veauryVitePlugins({
        type: 'react',
        reactOptions: {
          babel: {
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
            ],
          },
        },
        vueOptions: {},
        vueJsxOptions: {},
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 8000,
      proxy: {
        '/api': {
          // target: "http://code-backend.cnsaas.com/",
          target:'http://user-api.qa.gpyh.com/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/admin-api/, ''),
        },
      },
      hmr: true,
    },
    build: {
      lib: {
        // eslint-disable-next-line no-undef
        entry: path.resolve(__dirname, './src/packages/index'),
        name: 'CustomAmisEditor',
        fileName: 'main',
        // eslint-disable-next-line no-undef
        // output: path.resolve(__dirname, 'lib'),
        // format: 'es',
        ...buildCfg.lib,
      },
      outDir: buildCfg.outDir,
      rollupOptions: {
        external: [
          'lodash',
          'react',
          'react-dom',
          'history',
          'path-to-regexp',
          'copy-to-clipboard',
          // amis
          'amis',
          'amis-core',
          'amis-ui',
          'amis-editor',
          'amis-editor-core',
          'amis/lib/renderers/Form/Picker',
          'amis/lib/renderers/Form/NestedSelect',
          'amis-ui/lib/components/Select',
          'amis-editor/lib/renderer/OptionControl',
          'amis-editor/lib/renderer/event-control/helper',
          'amis-editor/lib/validator',
          // @fortawesome
          '@fortawesome/fontawesome-free/css/all.css',
          '@fortawesome/fontawesome-free/js/all',
          // moment
          'moment/dist/locale/zh-cn',
          // echarts
          'echarts-wordcloud',
          // veaury
          'veaury',
          // vue
          'vue',
          // element
          'elemenet-plus',
          'element-plus/dist/index.css',
          // tinymce
          // 'tinymce/tinymce',
          // /^tinymce\/(plugins|themes|icons|models)\/.+$/i,
          // 'tinymce-plugin',
          // '@tinymce/tinymce-vue',
          // /^tinymce\-plugin\/plugins\/.+/,
        ],
        output: {
          ...buildCfg.rollupOptions.output,
        },
      },
    },
  }
})
