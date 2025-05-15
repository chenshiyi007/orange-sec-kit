<template>
  <div class="user-agreement-container">
    <h1 class="title">用户协议</h1>

    <div class="content-wrapper">
      <div class="agreement-content">
        <h2>用户协议</h2>
        <div class="scrollable-content">
          <p>
            尊敬的用户，感谢您选择使用我们的安全工具。在使用本工具前，请仔细阅读并充分理解以下用户协议条款：
          </p>

          <h3>1. 工具用途</h3>
          <p>
            本工具仅供安全专业人员进行网络安全评估、漏洞检测与防御研究使用，旨在帮助提升系统安全性。
          </p>

          <h3>2. 合法使用</h3>
          <p>
            您必须确保在使用本工具时遵守所有适用的法律法规。严禁将本工具用于任何非法活动，包括但不限于：
          </p>
          <ul>
            <li>未经授权访问或破坏他人系统</li>
            <li>数据窃取或恶意破坏</li>
            <li>干扰网络服务或系统正常运行</li>
            <li>规避安全措施</li>
          </ul>

          <h3>3. 使用许可</h3>
          <p>本工具授予您非排他性、不可转让的使用权限。您不得：</p>
          <ul>
            <li>复制、修改、分发本工具的源代码（除非开源协议允许）</li>
            <li>对本工具进行反编译、反向工程</li>
            <li>移除任何版权信息或标识</li>
            <li>将本工具用于商业用途（除非获得明确授权）</li>
          </ul>

          <h3>4. 数据收集</h3>
          <p>
            本工具绝不会收集使用任何数据，请放心使用。
          </p>

          <h3>5. 责任限制</h3>
          <p>
            在法律允许的最大范围内，我们不对因使用或无法使用本工具而导致的任何直接、间接、附带、特殊、衍生或惩罚性损害承担责任。
          </p>

          <h3>6. 协议更新</h3>
          <p>
            我们保留随时修改本协议的权利。重大变更将通过适当方式通知您。持续使用本工具将视为接受修改后的协议。
          </p>
        </div>

        <h2>免责声明</h2>
        <div class="scrollable-content">
          <p>
            <strong>风险声明：</strong
            >使用本安全工具存在固有风险。本工具按"现状"提供，不提供任何形式的保证，包括但不限于适销性、特定用途适用性或不侵权的默示保证。
          </p>

          <p>
            <strong>无担保：</strong
            >我们不保证本工具无错误或能持续运行，不保证本工具发现的所有安全问题，也不保证本工具能适用于您的特定需求。
          </p>

          <p>
            <strong>使用责任：</strong
            >您对使用本工具的行为及其后果承担全部责任。在使用本工具前，应该进行充分的备份和安全措施。
          </p>

          <p>
            <strong>第三方内容：</strong
            >本工具可能提供第三方网站链接或内容，我们对此类第三方内容不承担任何责任。
          </p>

          <p>
            <strong>合规要求：</strong
            >您应了解并遵守与安全评估、渗透测试相关的所有法律法规。您必须获得对目标系统的合法授权后才能使用本工具。
          </p>

          <p>
            <strong>安全事件：</strong
            >如因使用本工具导致任何安全事件或数据泄露，我们不承担法律责任。
          </p>
        </div>
      </div>

      <div class="agreement-actions">
        <div class="checkbox-wrapper">
          <input type="checkbox" id="agreement-checkbox" v-model="isAgreed" />
          <label for="agreement-checkbox">我已阅读并同意上述用户协议和免责声明</label>
        </div>

        <div class="buttons">
          <button @click="handleExit" class="exit-button">退出</button>
          <button
            @click="handleConfirm"
            class="confirm-button"
            :disabled="!isAgreed"
            :class="{ loading: isLoading }"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { updateUserAgree } from '@/api/system'

const router = useRouter()
const isAgreed = ref(false)
const isLoading = ref(false)

const handleExit = () => {
  // 关闭应用程序
  window.close()
}

const handleConfirm = async () => {
  if (isAgreed.value) {
    try {
      isLoading.value = true
      // 调用后端接口更新用户同意状态
      const res = await updateUserAgree()

      if (res.data.code === 0) {
        // 使用code === 0作为成功标志
        // 保存用户协议同意状态到本地存储
        localStorage.setItem('userAgreedToTerms', 'true')
        // 导航到主页
        router.push('/home')
      } else {
        alert('提交失败：' + res.data.message)
      }
    } catch (error) {
      console.error('更新用户协议同意状态失败', error)
      alert('网络错误，请稍后重试')
    } finally {
      isLoading.value = false
    }
  }
}
</script>

<style scoped>
.user-agreement-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.content-wrapper {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.agreement-content {
  padding: 20px;
}

.scrollable-content {
  height: 200px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 20px;
  background: #f9f9f9;
  font-size: 14px;
  line-height: 1.6;
}

h2 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #2c3e50;
}

h3 {
  margin-top: 15px;
  margin-bottom: 8px;
  color: #2c3e50;
}

p {
  margin-bottom: 10px;
}

ul {
  padding-left: 20px;
}

.agreement-actions {
  padding: 20px;
  background: #f5f7fa;
  border-top: 1px solid #e0e0e0;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.checkbox-wrapper input {
  margin-right: 10px;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.exit-button {
  padding: 8px 16px;
  background: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.confirm-button.loading {
  opacity: 0.7;
}
</style>
