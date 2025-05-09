export const VulTypes = [
  { key: 'sql_inject', label: 'SQL注入' },
  { key: 'code_inject', label: '代码注入' },
  { key: 'rce', label: '命令执行' },
  { key: 'logic_vul', label: '逻辑漏洞' },
  { key: 'info_leak', label: '信息泄漏' },
  { key: 'unauth', label: '未授权访问' },
  { key: 'weak_pass', label: '弱口令' },
  { key: 'race_condition', label: '条件竞争' },
  { key: 'code_exec', label: '代码执行' },
  { key: 'file_include', label: '文件包含' },
  { key: 'file_op', label: '任意文件操作' },
  { key: 'url_redirect', label: 'URL重定向' },
  { key: 'xxe', label: 'XXE外部实体注入' },
  { key: 'ssrf', label: 'SSRF服务器端请求伪造' },
  { key: 'csrf', label: 'CSRF跨站请求伪造' },
  { key: 'others', label: '其他' },
]

export const VulLevel = [
  { key: 'low', label: '低危', color: 'cyan' },
  { key: 'middle', label: '中危', color: 'orange' },
  { key: 'high', label: '高危', color: 'purple' },
  { key: 'critical', label: '严重', color: 'pinkpurple' },
  { key: 'unknown', label: '其他', color: 'gray' },
]
