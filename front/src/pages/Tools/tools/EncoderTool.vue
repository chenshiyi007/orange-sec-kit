<template>
  <div class="burp-encoder-tool">
    <h2>{{ t('pages.tools.formatter.title') }}</h2>
    <p>{{ t('pages.tools.formatter.description') }}</p>

    <div class="burp-container">
      <!-- 输入面板 -->
      <div class="encoder-row">
        <div class="text-panel">
          <div class="panel-header">
            <h3>{{ t('pages.tools.formatter.inputText') }}</h3>
            <div class="format-type">
              <a-radio-group v-model="inputFormat" type="button" size="small">
                <a-radio value="text">Text</a-radio>
                <a-radio value="hex">Hex</a-radio>
              </a-radio-group>
            </div>
          </div>
          <a-textarea
            v-model="inputText"
            :placeholder="t('pages.tools.formatter.inputPlaceholder')"
            allow-clear
            :auto-size="{ minRows: 6, maxRows: 6 }"
            @input="processInputChange"
          />
          <div class="panel-footer">
            <a-button type="primary" status="normal" @click="clearAllText" size="small">
              {{ t('pages.tools.formatter.clear') }}
            </a-button>
          </div>
        </div>

        <div class="operation-panel">
          <div class="operation-group">
            <h4>{{ t('pages.tools.formatter.encode') }}</h4>
            <div class="operation-selects">
              <a-select
                v-model="selectedEncoding"
                @change="performEncodeOperation"
                size="small"
                :style="{ width: '100%' }"
                placeholder="Encode..."
                allow-clear
              >
                <a-option value="url">URL</a-option>
                <a-option value="url-enhanced">URL (Enhanced)</a-option>
                <a-option value="base64">Base64</a-option>
                <a-option value="base58">Base58</a-option>
                <a-option value="html">HTML</a-option>
                <a-option value="hex">Hex</a-option>
                <a-option value="unicode">Unicode</a-option>
              </a-select>
            </div>
          </div>

          <div class="operation-group">
            <h4>{{ t('pages.tools.formatter.decode') }}</h4>
            <div class="operation-selects">
              <a-select
                v-model="selectedDecoding"
                @change="performDecodeOperation"
                size="small"
                :style="{ width: '100%' }"
                placeholder="Decode..."
                allow-clear
              >
                <a-option value="url">URL</a-option>
                <a-option value="url-enhanced">URL (Enhanced)</a-option>
                <a-option value="base64">Base64</a-option>
                <a-option value="base58">Base58</a-option>
                <a-option value="html">HTML</a-option>
                <a-option value="hex">Hex</a-option>
                <a-option value="unicode">Unicode</a-option>
              </a-select>
            </div>
          </div>
        </div>
      </div>

      <!-- 动态生成的结果面板 -->
      <div v-for="(result, index) in results" :key="index" class="encoder-row">
        <div class="text-panel">
          <div class="panel-header">
            <h3>Result {{ index + 1 }}: {{ result.operation }}</h3>
            <div class="format-type">
              <a-radio-group
                v-model="result.format"
                type="button"
                size="small"
                @change="formatChanged(index)"
              >
                <a-radio value="text">Text</a-radio>
                <a-radio value="hex">Hex</a-radio>
              </a-radio-group>
            </div>
          </div>
          <a-textarea v-model="result.text" readonly :auto-size="{ minRows: 6, maxRows: 6 }" />
          <div class="panel-footer">
            <a-button type="primary" @click="copyResultToClipboard(index)" size="small">
              {{ t('pages.tools.formatter.copyToClipboard') }}
            </a-button>
            <!-- 移除Edit按钮 -->
            <a-button
              type="outline"
              status="danger"
              @click="deleteOperation(index)"
              size="small"
              v-if="index < results.length - 1"
            >
              Delete
            </a-button>
          </div>
        </div>

        <!-- 每个结果都有操作面板 -->
        <div class="operation-panel">
          <div class="operation-group">
            <h4>{{ t('pages.tools.formatter.encode') }}</h4>
            <div class="operation-selects">
              <a-select
                :model-value="
                  index === results.length - 1 ? nextSelectedEncoding : tempEncodingValues[index]
                "
                @update:model-value="(val) => performNextEncode(index, val as string)"
                size="small"
                :style="{ width: '100%' }"
                placeholder="Encode..."
                allow-clear
              >
                <a-option value="url">URL</a-option>
                <a-option value="url-enhanced">URL (Enhanced)</a-option>
                <a-option value="base64">Base64</a-option>
                <a-option value="base58">Base58</a-option>
                <a-option value="html">HTML</a-option>
                <a-option value="hex">Hex</a-option>
                <a-option value="unicode">Unicode</a-option>
              </a-select>
            </div>
          </div>

          <div class="operation-group">
            <h4>{{ t('pages.tools.formatter.decode') }}</h4>
            <div class="operation-selects">
              <a-select
                :model-value="
                  index === results.length - 1 ? nextSelectedDecoding : tempDecodingValues[index]
                "
                @update:model-value="(val) => performNextDecode(index, val as string)"
                size="small"
                :style="{ width: '100%' }"
                placeholder="Decode..."
                allow-clear
              >
                <a-option value="url">URL</a-option>
                <a-option value="url-enhanced">URL (Enhanced)</a-option>
                <a-option value="base64">Base64</a-option>
                <a-option value="base58">Base58</a-option>
                <a-option value="html">HTML</a-option>
                <a-option value="hex">Hex</a-option>
                <a-option value="unicode">Unicode</a-option>
              </a-select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'

const { t } = useI18n()

// 定义结果接口
interface Result {
  text: string
  format: 'text' | 'hex'
  operation: string
  originalOperation: {
    type: 'encode' | 'decode'
    method: string
  }
}

// 输入值和格式
const inputText = ref('')
const inputFormat = ref('text')

// 操作选项
const selectedEncoding = ref('')
const selectedDecoding = ref('')
const nextSelectedEncoding = ref('')
const nextSelectedDecoding = ref('')

// 结果数组 - 存储所有操作结果
const results = ref<Result[]>([])

// 操作历史 - 用于重新应用
const operations = ref<{ type: 'encode' | 'decode'; method: string }[]>([])

// 添加临时变量存储中间结果的选择值
const tempEncodingValues = ref<{ [key: number]: string }>({})
const tempDecodingValues = ref<{ [key: number]: string }>({})

// 监听输入变化，重新应用所有操作
const processInputChange = () => {
  if (operations.value.length > 0) {
    reapplyOperations()
  }
}

// 编码操作
const performEncodeOperation = () => {
  if (!selectedEncoding.value) return

  if (!inputText.value) {
    Message.warning(t('pages.tools.formatter.noInputText'))
    selectedEncoding.value = ''
    return
  }

  const method = selectedEncoding.value
  try {
    const result = encodeText(inputText.value, method, inputFormat.value, 'text')

    // 更新操作历史
    operations.value = [{ type: 'encode', method }]

    // 清空之前的结果
    results.value = []

    // 添加新结果
    results.value.push({
      text: result,
      format: 'text',
      operation: `${method.toUpperCase()} Encoded`,
      originalOperation: { type: 'encode', method },
    })

    Message.success(`${method.toUpperCase()} Encoded`)
    selectedEncoding.value = ''
  } catch (e: any) {
    Message.error(`${method.toUpperCase()} Encode failed: ${e.message || ''}`)
    selectedEncoding.value = ''
  }
}

// 解码操作
const performDecodeOperation = () => {
  if (!selectedDecoding.value) return

  if (!inputText.value) {
    Message.warning(t('pages.tools.formatter.noInputText'))
    selectedDecoding.value = ''
    return
  }

  const method = selectedDecoding.value
  try {
    const result = decodeText(inputText.value, method, inputFormat.value, 'text')

    // 更新操作历史
    operations.value = [{ type: 'decode', method }]

    // 清空之前的结果
    results.value = []

    // 添加新结果
    results.value.push({
      text: result,
      format: 'text',
      operation: `${method.toUpperCase()} Decoded`,
      originalOperation: { type: 'decode', method },
    })

    Message.success(`${method.toUpperCase()} Decoded`)
    selectedDecoding.value = ''
  } catch (e: any) {
    Message.error(`${method.toUpperCase()} Decode failed: ${e.message || ''}`)
    selectedDecoding.value = ''
  }
}

// 修改继续编码和解码函数，接收编码/解码方法参数
const performNextEncode = (index: number, method: string) => {
  // 清空当前索引的编码值
  if (index === results.value.length - 1) {
    nextSelectedEncoding.value = ''
  } else {
    tempEncodingValues.value[index] = ''
  }

  if (!method) return

  const sourceResult = results.value[index]

  try {
    const result = encodeText(sourceResult.text, method, sourceResult.format, 'text')

    // 如果是编辑中间结果，需要替换后续操作结果
    if (index < results.value.length - 1) {
      // 更新操作历史，插入新操作
      operations.value.splice(index + 1, operations.value.length - index - 1, {
        type: 'encode',
        method,
      })

      // 删除后续结果
      results.value.splice(index + 1)
    } else {
      // 添加到操作历史
      operations.value.push({ type: 'encode', method })
    }

    // 添加新结果
    results.value.push({
      text: result,
      format: 'text',
      operation: `${method.toUpperCase()} Encoded`,
      originalOperation: { type: 'encode', method },
    })

    Message.success(`${method.toUpperCase()} Encoded`)
  } catch (e: any) {
    Message.error(`${method.toUpperCase()} Encode failed: ${e.message || ''}`)
  }
}

// 对结果继续解码
const performNextDecode = (index: number, method: string) => {
  // 清空当前索引的解码值
  if (index === results.value.length - 1) {
    nextSelectedDecoding.value = ''
  } else {
    tempDecodingValues.value[index] = ''
  }

  if (!method) return

  const sourceResult = results.value[index]

  try {
    const result = decodeText(sourceResult.text, method, sourceResult.format, 'text')

    // 如果是编辑中间结果，需要替换后续操作结果
    if (index < results.value.length - 1) {
      // 更新操作历史，插入新操作
      operations.value.splice(index + 1, operations.value.length - index - 1, {
        type: 'decode',
        method,
      })

      // 删除后续结果
      results.value.splice(index + 1)
    } else {
      // 添加到操作历史
      operations.value.push({ type: 'decode', method })
    }

    // 添加新结果
    results.value.push({
      text: result,
      format: 'text',
      operation: `${method.toUpperCase()} Decoded`,
      originalOperation: { type: 'decode', method },
    })

    Message.success(`${method.toUpperCase()} Decoded`)
  } catch (e: any) {
    Message.error(`${method.toUpperCase()} Decode failed: ${e.message || ''}`)
  }
}

// 重新应用所有操作
const reapplyOperations = () => {
  if (operations.value.length === 0) return

  let currentText = inputText.value
  let currentFormat = inputFormat.value
  results.value = []

  // 逐个应用操作
  operations.value.forEach((op, index) => {
    try {
      let newText
      if (op.type === 'encode') {
        newText = encodeText(currentText, op.method, currentFormat, 'text')
      } else {
        newText = decodeText(currentText, op.method, currentFormat, 'text')
      }

      // 添加结果
      results.value.push({
        text: newText,
        format: 'text',
        operation: `${op.method.toUpperCase()} ${op.type === 'encode' ? 'Encoded' : 'Decoded'}`,
        originalOperation: { type: op.type, method: op.method },
      })

      // 更新当前文本和格式用于下一步操作
      currentText = newText
      currentFormat = 'text'
    } catch (e: any) {
      // 如果操作失败，终止链式操作
      Message.error(`Operation ${index + 1} failed, chain broken`)
      operations.value = operations.value.slice(0, index)
      return
    }
  })
}

// 格式更改处理
const formatChanged = (index: number) => {
  const result = results.value[index]

  if (result.format === 'hex') {
    // 转换为Hex格式
    try {
      result.text = textToHex(result.text)
    } catch (e) {
      Message.error('Failed to convert to Hex format')
      result.format = 'text'
    }
  } else {
    // 转换为Text格式
    try {
      result.text = hexToText(result.text)
    } catch (e) {
      Message.error('Failed to convert from Hex format')
      result.format = 'hex'
    }
  }

  // 如果修改了中间结果的格式，需要重新应用后续操作
  if (index < results.value.length - 1) {
    const currentResult = results.value[index]
    const subsequentOperations = operations.value.slice(index + 1)

    let currentText = currentResult.text
    let currentFormat = currentResult.format

    // 删除此结果后的所有结果
    results.value = results.value.slice(0, index + 1)

    // 重新应用后续操作
    subsequentOperations.forEach((op) => {
      try {
        let newText
        if (op.type === 'encode') {
          newText = encodeText(currentText, op.method, currentFormat, 'text')
        } else {
          newText = decodeText(currentText, op.method, currentFormat, 'text')
        }

        // 添加结果
        results.value.push({
          text: newText,
          format: 'text',
          operation: `${op.method.toUpperCase()} ${op.type === 'encode' ? 'Encoded' : 'Decoded'}`,
          originalOperation: { type: op.type, method: op.method },
        })

        // 更新当前文本和格式用于下一步操作
        currentText = newText
        currentFormat = 'text'
      } catch (e: any) {
        Message.error(`Subsequent operation failed, chain broken`)
        operations.value = operations.value.slice(0, index + 1)
        return
      }
    })
  }
}

// 编码实现
const encodeText = (text: string, method: string, fromFormat: string, toFormat: string) => {
  let input = text
  if (fromFormat === 'hex') {
    input = hexToText(input)
  }

  let result = ''
  switch (method) {
    case 'url':
      result = encodeURIComponent(input)
      break
    case 'url-enhanced':
      // URL 增强编码模式，对所有字符进行编码
      result = Array.from(input)
        .map((char) => {
          // 编码所有字符，包括字母和数字
          return '%' + char.charCodeAt(0).toString(16).padStart(2, '0')
        })
        .join('')
      break
    case 'base64':
      result = btoa(unescape(encodeURIComponent(input)))
      break
    case 'base58':
      result = base58Encode(input)
      break
    case 'html':
      result = input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
      break
    case 'hex':
      result = textToHex(input)
      break
    case 'unicode':
      result = input
        .split('')
        .map((char) => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'))
        .join('')
      break
    default:
      throw new Error('Unknown encoding method')
  }

  // 转换结果格式
  if (toFormat === 'hex' && method !== 'hex') {
    return textToHex(result)
  }

  return result
}

// 解码实现
const decodeText = (text: string, method: string, fromFormat: string, toFormat: string) => {
  let input = text
  if (fromFormat === 'hex') {
    input = hexToText(input)
  }

  let result = ''
  switch (method) {
    case 'url':
      result = decodeURIComponent(input)
      break
    case 'url-enhanced':
      // URL 增强解码模式
      result = input.replace(/%([0-9A-Fa-f]{2})/g, (_, hex) => {
        return String.fromCharCode(parseInt(hex, 16))
      })
      break
    case 'base64':
      try {
        result = decodeURIComponent(escape(atob(input)))
      } catch (error) {
        throw new Error('Invalid Base64 input')
      }
      break
    case 'base58':
      try {
        result = base58Decode(input)
      } catch (error) {
        throw new Error('Invalid Base58 input')
      }
      break
    case 'html':
      const txt = document.createElement('textarea')
      txt.innerHTML = input
      result = txt.value
      break
    case 'hex':
      if (!/^[0-9A-Fa-f\s]+$/.test(input.trim())) {
        throw new Error('Invalid hex input')
      }
      result = hexToText(input)
      break
    case 'unicode':
      result = input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      )
      break
    default:
      throw new Error('Unknown decoding method')
  }

  // 转换结果格式
  if (toFormat === 'hex') {
    return textToHex(result)
  }

  return result
}

// 工具函数
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
  if (cleanHex.length % 2 !== 0) {
    throw new Error('Invalid hex string (odd length)')
  }

  let result = ''
  for (let i = 0; i < cleanHex.length; i += 2) {
    const charCode = parseInt(cleanHex.substr(i, 2), 16)
    if (isNaN(charCode)) {
      throw new Error('Invalid hex characters')
    }
    result += String.fromCharCode(charCode)
  }
  return result
}

// Base58 编码和解码
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const ALPHABET_MAP: { [key: string]: number } = {}

for (let i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = i
}

const base58Encode = (input: string) => {
  const bytes = new TextEncoder().encode(input)
  let result = ''
  let leading_zeros = 0

  // Count leading zeros
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
    leading_zeros++
  }

  // Convert bytes to a big integer
  let num = 0n
  for (let i = 0; i < bytes.length; i++) {
    num = num * 256n + BigInt(bytes[i])
  }

  // Convert the big integer to base58
  while (num > 0) {
    const mod = Number(num % 58n)
    num = num / 58n
    result = ALPHABET.charAt(mod) + result
  }

  // Add leading '1's (representing zeros)
  for (let i = 0; i < leading_zeros; i++) {
    result = '1' + result
  }

  return result
}

const base58Decode = (input: string) => {
  if (input.length === 0) return ''

  // Convert from Base58 to a big integer
  let num = 0n
  for (let i = 0; i < input.length; i++) {
    num = num * 58n + BigInt(ALPHABET_MAP[input.charAt(i)])
  }

  // Count leading '1's
  let leading_zeros = 0
  for (let i = 0; i < input.length && input.charAt(i) === '1'; i++) {
    leading_zeros++
  }

  // Convert the big integer to bytes
  let bytes: number[] = []
  while (num > 0n) {
    bytes.unshift(Number(num % 256n))
    num = num / 256n
  }

  // Add leading zeros
  for (let i = 0; i < leading_zeros; i++) {
    bytes.unshift(0)
  }

  return new TextDecoder().decode(new Uint8Array(bytes))
}

// UI 事件处理
const clearAllText = () => {
  inputText.value = ''
  results.value = []
  operations.value = []
  selectedEncoding.value = ''
  selectedDecoding.value = ''
  nextSelectedEncoding.value = ''
  nextSelectedDecoding.value = ''
  Message.info(t('pages.tools.formatter.textCleared'))
}

const copyResultToClipboard = (index: number) => {
  const result = results.value[index]
  if (!result || !result.text) {
    Message.warning('No text to copy')
    return
  }

  navigator.clipboard
    .writeText(result.text)
    .then(() => {
      Message.success(t('pages.tools.formatter.copiedToClipboard'))
    })
    .catch(() => {
      Message.error(t('pages.tools.formatter.failedToCopy'))
    })
}

const useResultAsInput = (index: number) => {
  const result = results.value[index]
  if (!result || !result.text) {
    Message.warning(t('pages.tools.formatter.noOutputToCopy'))
    return
  }

  inputText.value = result.text
  inputFormat.value = result.format
  results.value = []
  operations.value = []
  selectedEncoding.value = ''
  selectedDecoding.value = ''
  nextSelectedEncoding.value = ''
  nextSelectedDecoding.value = ''
  Message.success('Result used as new input')
}

// 删除操作
const deleteOperation = (index: number) => {
  if (index >= operations.value.length) return

  // 删除对应的操作和结果
  operations.value.splice(index, 1)

  // 更新结果数组
  reapplyOperations()

  Message.success('Operation removed')
}

// 编辑操作
const editOperation = (index: number) => {
  if (index >= operations.value.length) return

  // 获取要编辑的操作
  const operation = operations.value[index]

  // 弹出操作选择对话框
  const editDialog = document.createElement('div')
  editDialog.className = 'operation-edit-dialog'
  editDialog.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
      <div style="background: var(--color-bg-2); padding: 20px; border-radius: 4px; min-width: 300px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
        <h3 style="margin-top: 0;">Edit Operation</h3>
        <div id="operationTypeOptions">
          <label style="display: block; margin-bottom: 10px;">
            <input type="radio" name="opType" value="encode" ${operation.type === 'encode' ? 'checked' : ''}> Encode
          </label>
          <label style="display: block; margin-bottom: 10px;">
            <input type="radio" name="opType" value="decode" ${operation.type === 'decode' ? 'checked' : ''}> Decode
          </label>
        </div>
        <div id="methodOptions" style="margin: 10px 0;">
          <select id="methodSelect" style="width: 100%; padding: 5px;">
            <option value="url" ${operation.method === 'url' ? 'selected' : ''}>URL</option>
            <option value="url-enhanced" ${operation.method === 'url-enhanced' ? 'selected' : ''}>URL (Enhanced)</option>
            <option value="base64" ${operation.method === 'base64' ? 'selected' : ''}>Base64</option>
            <option value="base58" ${operation.method === 'base58' ? 'selected' : ''}>Base58</option>
            <option value="html" ${operation.method === 'html' ? 'selected' : ''}>HTML</option>
            <option value="hex" ${operation.method === 'hex' ? 'selected' : ''}>Hex</option>
            <option value="unicode" ${operation.method === 'unicode' ? 'selected' : ''}>Unicode</option>
          </select>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px;">
          <button id="cancelEditBtn" style="padding: 5px 10px;">Cancel</button>
          <button id="saveEditBtn" style="padding: 5px 10px; background: var(--color-primary); color: white; border: none; border-radius: 2px;">Save</button>
        </div>
      </div>
    </div>
  `

  document.body.appendChild(editDialog)

  // 绑定事件
  document.getElementById('saveEditBtn')?.addEventListener('click', () => {
    const type = document.querySelector('input[name="opType"]:checked') as HTMLInputElement
    const method = document.getElementById('methodSelect') as HTMLSelectElement

    if (type && method) {
      // 更新操作
      operations.value[index] = {
        type: type.value as 'encode' | 'decode',
        method: method.value,
      }

      // 重新应用操作
      reapplyOperations()

      // 移除对话框
      document.body.removeChild(editDialog)

      Message.success('Operation updated')
    }
  })

  document.getElementById('cancelEditBtn')?.addEventListener('click', () => {
    document.body.removeChild(editDialog)
  })
}
</script>

<style scoped>
.burp-encoder-tool {
  padding: 16px;
}

.burp-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.encoder-row {
  display: flex;
  gap: 16px;
}

.text-panel {
  flex: 3;
  background-color: var(--color-bg-2);
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.operation-panel {
  flex: 1;
  background-color: var(--color-bg-2);
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
}

.panel-footer {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.operation-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.operation-group h4 {
  margin: 0;
  font-size: 14px;
  text-align: center;
}

.operation-selects {
  display: flex;
  justify-content: center;
}

:deep(.arco-radio-group) {
  flex-wrap: wrap;
  justify-content: center;
}

:deep(.arco-radio-button) {
  margin: 2px;
}

/* 适配移动设备 */
@media (max-width: 1024px) {
  .encoder-row {
    flex-direction: column;
  }

  .operation-panel {
    flex-direction: row;
  }
}
</style>
