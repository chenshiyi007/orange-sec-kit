<template>
  <div class="burp-crypto-tool">
    <h2>{{ t('pages.tools.cryptoTool.title') }}</h2>
    <p>{{ t('pages.tools.cryptoTool.description') }}</p>

    <div class="burp-container">
      <div class="input-panel">
        <div class="input-area">
          <div class="panel-header">
            <h3>{{ t('pages.tools.formatter.inputText') }}</h3>
            <div class="format-type">
              <a-radio-group v-model="inputFormat" type="button" size="small">
                <a-radio value="text">{{ t('pages.tools.cryptoTool.inputText') }}</a-radio>
                <a-radio value="hex">Hex</a-radio>
              </a-radio-group>
            </div>
          </div>
          <a-textarea
            v-model="inputText"
            :placeholder="t('pages.tools.formatter.inputPlaceholder')"
            allow-clear
            :auto-size="{ minRows: 6, maxRows: 6 }"
          />
        </div>

        <div class="operations">
          <div class="operation-group">
            <h4>{{ t('pages.tools.formatter.encrypt') }}</h4>
            <div class="operation-row">
              <a-select
                v-model="hashOperation"
                :style="{ width: '100%' }"
                size="small"
                :placeholder="t('pages.tools.cryptoTool.selectHashMethod')"
                allow-clear
              >
                <a-option value="md5">MD5</a-option>
                <a-option value="sha1">SHA-1</a-option>
                <a-option value="sha256">SHA-256</a-option>
                <a-option value="sha512">SHA-512</a-option>
                <a-option value="hmac">HMAC-SHA256</a-option>
              </a-select>
              <a-button type="primary" @click="performHash" :disabled="!hashOperation" size="small">
                {{ t('pages.tools.cryptoTool.hash') }}
              </a-button>
            </div>

            <div class="key-input" v-if="['hmac'].includes(hashOperation)">
              <a-input
                v-model="secretKey"
                :placeholder="t('pages.tools.cryptoTool.secretKey')"
                allow-clear
                size="small"
              />
            </div>

            <div class="divider">
              <a-divider style="margin: 8px 0">{{
                t('pages.tools.cryptoTool.symmetricEncryption')
              }}</a-divider>
            </div>

            <div class="operation-row">
              <a-select
                v-model="encryptOperation"
                :style="{ width: '100%' }"
                size="small"
                @change="checkKeyRequired"
                :placeholder="t('pages.tools.cryptoTool.selectEncryptionMethod')"
                allow-clear
              >
                <a-option value="aes">AES</a-option>
                <a-option value="des">DES</a-option>
                <a-option value="tripledes">Triple DES</a-option>
                <a-option value="rc4">RC4</a-option>
                <a-option value="rabbit">Rabbit</a-option>
              </a-select>
              <a-button
                type="primary"
                @click="performEncrypt"
                :disabled="!encryptOperation"
                size="small"
              >
                {{ t('pages.tools.cryptoTool.encrypt') }}
              </a-button>
            </div>

            <div class="operation-row">
              <a-select
                v-model="decryptOperation"
                :style="{ width: '100%' }"
                size="small"
                @change="checkKeyRequired"
                :placeholder="t('pages.tools.cryptoTool.selectDecryptionMethod')"
                allow-clear
              >
                <a-option value="aes">AES</a-option>
                <a-option value="des">DES</a-option>
                <a-option value="tripledes">Triple DES</a-option>
                <a-option value="rc4">RC4</a-option>
                <a-option value="rabbit">Rabbit</a-option>
              </a-select>
              <a-button
                type="primary"
                @click="performDecrypt"
                :disabled="!decryptOperation"
                size="small"
              >
                Decrypt
              </a-button>
            </div>

            <div class="key-input" v-if="showKeyInput">
              <a-input
                v-model="encryptionKey"
                :placeholder="
                  encryptOperation === 'des' || decryptOperation === 'des'
                    ? t('pages.tools.cryptoTool.desKeyPlaceholder')
                    : t('pages.tools.cryptoTool.encryptionKey')
                "
                allow-clear
                size="small"
              />

              <!-- 加密模式选择 -->
              <div
                v-if="
                  ['aes', 'des', 'tripledes'].includes(encryptOperation) ||
                  ['aes', 'des', 'tripledes'].includes(decryptOperation)
                "
                class="mode-select"
                style="margin-top: 8px"
              >
                <a-select v-model="encryptionMode" style="width: 100%" size="small">
                  <a-option value="ecb">{{ t('pages.tools.cryptoTool.ecbMode') }}</a-option>
                  <a-option value="cbc">{{ t('pages.tools.cryptoTool.cbcMode') }}</a-option>
                  <a-option value="cfb">{{ t('pages.tools.cryptoTool.cfbMode') }}</a-option>
                  <a-option value="ofb">{{ t('pages.tools.cryptoTool.ofbMode') }}</a-option>
                  <a-option value="ctr">{{ t('pages.tools.cryptoTool.ctrMode') }}</a-option>
                </a-select>
              </div>

              <!-- IV向量输入框 -->
              <div v-if="showIvInput" style="margin-top: 8px">
                <a-input
                  v-model="iv"
                  :placeholder="t('pages.tools.cryptoTool.ivInputPlaceholder')"
                  allow-clear
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="output-area">
          <div class="panel-header">
            <h3>{{ t('pages.tools.formatter.outputText') }}</h3>
            <div class="format-type">
              <a-radio-group v-model="outputFormat" type="button" size="small">
                <a-radio value="text">{{ t('pages.tools.cryptoTool.outputText') }}</a-radio>
                <a-radio value="hex">Hex</a-radio>
              </a-radio-group>
            </div>
          </div>
          <a-textarea
            v-model="outputText"
            :placeholder="t('pages.tools.formatter.outputPlaceholder')"
            readonly
            :auto-size="{ minRows: 6, maxRows: 6 }"
          />
          <div class="panel-footer">
            <a-button type="primary" @click="copyToClipboard" size="small">
              {{ t('pages.tools.formatter.copyToClipboard') }}
            </a-button>
            <a-button type="primary" status="warning" @click="clearText" size="small">
              {{ t('pages.tools.formatter.clear') }}
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import CryptoJS from 'crypto-js'

const { t } = useI18n()

// Text values
const inputText = ref('')
const outputText = ref('')
const inputFormat = ref('text')
const outputFormat = ref('text')
const encryptOperation = ref('')
const decryptOperation = ref('')
const hashOperation = ref('')
const secretKey = ref('')
const encryptionKey = ref('')
const iv = ref('')
const encryptionMode = ref('ecb')

// 根据所选操作决定是否显示密钥输入框
const showKeyInput = computed(() => {
  return (
    ['aes', 'des', 'tripledes', 'rc4', 'rabbit'].includes(encryptOperation.value) ||
    ['aes', 'des', 'tripledes', 'rc4', 'rabbit'].includes(decryptOperation.value)
  )
})

// 根据所选操作和模式决定是否显示IV输入框
const showIvInput = computed(() => {
  const needsIv = ['cbc', 'cfb', 'ofb', 'ctr'].includes(encryptionMode.value)
  const isSymmetricCipher =
    ['aes', 'des', 'tripledes'].includes(encryptOperation.value) ||
    ['aes', 'des', 'tripledes'].includes(decryptOperation.value)
  return needsIv && isSymmetricCipher
})

// 当选择操作时检查是否需要密钥
const checkKeyRequired = () => {
  if (showKeyInput.value && !encryptionKey.value) {
    Message.warning(t('pages.tools.cryptoTool.keyRequired'))
  }
}

// Hash functions
const performHash = () => {
  if (!inputText.value) {
    Message.warning(t('pages.tools.cryptoTool.noInputText'))
    return
  }

  if (!secretKey.value) {
    Message.warning(t('pages.tools.cryptoTool.secretKeyRequired'))
    return
  }

  let input = inputText.value
  if (inputFormat.value === 'hex') {
    input = hexToText(input)
  }

  try {
    switch (hashOperation.value) {
      case 'md5':
        outputText.value = CryptoJS.MD5(input).toString()
        break
      case 'sha1':
        outputText.value = CryptoJS.SHA1(input).toString()
        break
      case 'sha256':
        outputText.value = CryptoJS.SHA256(input).toString()
        break
      case 'sha512':
        outputText.value = CryptoJS.SHA512(input).toString()
        break
      case 'hmac':
        outputText.value = CryptoJS.HmacSHA256(input, secretKey.value).toString()
        break
      default:
        Message.error('Please select a hash method')
        return
    }

    // Convert output to hex if needed
    if (outputFormat.value === 'hex') {
      outputText.value = textToHex(outputText.value)
    }

    Message.success(
      `${hashOperation.value.toUpperCase()} ${t('pages.tools.cryptoTool.hashGenerated')}`,
    )
    hashOperation.value = ''
  } catch (e: any) {
    Message.error(`${hashOperation.value.toUpperCase()} Hash failed: ${e.message || ''}`)
  }
}

// Encryption functions
const performEncrypt = () => {
  if (!inputText.value) {
    Message.warning(t('pages.tools.cryptoTool.noInputText'))
    return
  }

  if (!encryptionKey.value) {
    Message.warning(t('pages.tools.cryptoTool.keyRequired'))
    return
  }

  if (showIvInput.value && !iv.value) {
    Message.warning(t('pages.tools.cryptoTool.ivRequired'))
    return
  }

  let input = inputText.value
  if (inputFormat.value === 'hex') {
    input = hexToText(input)
  }

  try {
    const key = CryptoJS.enc.Utf8.parse(encryptionKey.value)
    let encrypted

    // 默认配置
    const encryptConfig: any = {
      padding: CryptoJS.pad.Pkcs7,
    }

    // 根据选择的模式设置配置
    switch (encryptionMode.value) {
      case 'ecb':
        encryptConfig.mode = CryptoJS.mode.ECB
        break
      case 'cbc':
        encryptConfig.mode = CryptoJS.mode.CBC
        if (iv.value) {
          encryptConfig.iv = CryptoJS.enc.Utf8.parse(iv.value)
        }
        break
      case 'cfb':
        encryptConfig.mode = CryptoJS.mode.CFB
        if (iv.value) {
          encryptConfig.iv = CryptoJS.enc.Utf8.parse(iv.value)
        }
        break
      case 'ofb':
        encryptConfig.mode = CryptoJS.mode.OFB
        if (iv.value) {
          encryptConfig.iv = CryptoJS.enc.Utf8.parse(iv.value)
        }
        break
      case 'ctr':
        encryptConfig.mode = CryptoJS.mode.CTR
        if (iv.value) {
          encryptConfig.iv = CryptoJS.enc.Utf8.parse(iv.value)
        }
        break
    }

    switch (encryptOperation.value) {
      case 'aes':
        encrypted = CryptoJS.AES.encrypt(input, key, encryptConfig)
        break
      case 'des':
        encrypted = CryptoJS.DES.encrypt(input, key, encryptConfig)
        break
      case 'tripledes':
        encrypted = CryptoJS.TripleDES.encrypt(input, key, encryptConfig)
        break
      case 'rc4':
        encrypted = CryptoJS.RC4.encrypt(input, key)
        break
      case 'rabbit':
        encrypted = CryptoJS.Rabbit.encrypt(input, key)
        break
      default:
        Message.error('Please select an encryption method')
        return
    }

    outputText.value = encrypted.toString()

    // Convert output to hex if needed
    if (outputFormat.value === 'hex') {
      outputText.value = textToHex(outputText.value)
    }

    Message.success(
      `${encryptOperation.value.toUpperCase()} ${t('pages.tools.cryptoTool.encryptedSuccessfully')}`,
    )
    encryptOperation.value = ''
  } catch (e: any) {
    Message.error(
      `${encryptOperation.value.toUpperCase()} ${t('pages.tools.cryptoTool.encryptionFailed')}: ${e.message || ''}`,
    )
  }
}

// Decryption functions
const performDecrypt = () => {
  if (!inputText.value) {
    Message.warning(t('pages.tools.cryptoTool.noInputText'))
    return
  }

  if (!encryptionKey.value) {
    Message.warning(t('pages.tools.cryptoTool.keyRequired'))
    return
  }

  if (showIvInput.value && !iv.value) {
    Message.warning(t('pages.tools.cryptoTool.ivRequired'))
    return
  }

  let input = inputText.value
  if (inputFormat.value === 'hex') {
    input = hexToText(input)
  }

  try {
    const key = CryptoJS.enc.Utf8.parse(encryptionKey.value)
    let decrypted

    // 默认配置
    const decryptConfig: any = {
      padding: CryptoJS.pad.Pkcs7,
    }

    // 根据选择的模式设置配置
    switch (encryptionMode.value) {
      case 'ecb':
        decryptConfig.mode = CryptoJS.mode.ECB
        break
      case 'cbc':
        decryptConfig.mode = CryptoJS.mode.CBC
        if (iv.value) {
          decryptConfig.iv = CryptoJS.enc.Utf8.parse(iv.value)
        }
        break
      case 'cfb':
        decryptConfig.mode = CryptoJS.mode.CFB
        if (iv.value) {
          decryptConfig.iv = CryptoJS.enc.Utf8.parse(iv.value)
        }
        break
      case 'ofb':
        decryptConfig.mode = CryptoJS.mode.OFB
        if (iv.value) {
          decryptConfig.iv = CryptoJS.enc.Utf8.parse(iv.value)
        }
        break
      case 'ctr':
        decryptConfig.mode = CryptoJS.mode.CTR
        if (iv.value) {
          decryptConfig.iv = CryptoJS.enc.Utf8.parse(iv.value)
        }
        break
    }

    switch (decryptOperation.value) {
      case 'aes':
        decrypted = CryptoJS.AES.decrypt(input, key, decryptConfig)
        break
      case 'des':
        decrypted = CryptoJS.DES.decrypt(input, key, decryptConfig)
        break
      case 'tripledes':
        decrypted = CryptoJS.TripleDES.decrypt(input, key, decryptConfig)
        break
      case 'rc4':
        decrypted = CryptoJS.RC4.decrypt(input, key)
        break
      case 'rabbit':
        decrypted = CryptoJS.Rabbit.decrypt(input, key)
        break
      default:
        Message.error('Please select a decryption method')
        return
    }

    outputText.value = decrypted.toString(CryptoJS.enc.Utf8)

    // Convert output to hex if needed
    if (outputFormat.value === 'hex') {
      outputText.value = textToHex(outputText.value)
    }

    Message.success(
      `${decryptOperation.value.toUpperCase()} ${t('pages.tools.cryptoTool.decryptedSuccessfully')}`,
    )
    decryptOperation.value = ''
  } catch (e: any) {
    Message.error(
      `${decryptOperation.value.toUpperCase()} ${t('pages.tools.cryptoTool.decryptionFailed')}: ${e.message || ''}`,
    )
  }
}

// Utility functions
const textToHex = (text: string) => {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const hex = text.charCodeAt(i).toString(16).padStart(2, '0')
    result += hex + ' '
  }
  return result.trim()
}

const hexToText = (hex: string) => {
  const cleanHex = hex.replace(/\s+/g, '')
  let result = ''
  for (let i = 0; i < cleanHex.length; i += 2) {
    result += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16))
  }
  return result
}

const clearText = () => {
  inputText.value = ''
  outputText.value = ''
  Message.info(t('pages.tools.cryptoTool.textCleared'))
}

const copyToClipboard = () => {
  if (!outputText.value) {
    Message.warning(t('pages.tools.cryptoTool.noOutputToCopy'))
    return
  }

  navigator.clipboard
    .writeText(outputText.value)
    .then(() => {
      Message.success(t('pages.tools.cryptoTool.copiedToClipboard'))
    })
    .catch(() => {
      Message.error(t('pages.tools.cryptoTool.failedToCopy'))
    })
}
</script>

<style scoped>
.burp-crypto-tool {
  padding: 16px;
}

.burp-container {
  margin-top: 20px;
}

.input-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-area,
.output-area {
  background-color: var(--color-bg-2);
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.panel-footer {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.format-type {
  display: flex;
  align-items: center;
}

.operations {
  background-color: var(--color-bg-2);
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.operation-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.operation-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.key-input {
  margin-top: 4px;
}

.divider {
  margin: 4px 0;
}

@media (max-width: 1024px) {
  .operation-row {
    flex-direction: column;
    width: 100%;
  }

  .operation-row > .arco-select {
    width: 100% !important;
  }

  .operation-row > .arco-btn {
    width: 100%;
  }
}
</style>
