export default {
  common: {
    switchLanguage: 'Switch Language',
    chinese: '中文',
    english: 'English',
    unknownError: 'Unknown Error',
    serviceError: 'Service Error',
    cancel: 'Cancel',
    save: 'Save',
    uploadImages: {
      missingInformation: 'Missing required information, cannot upload',
      noImageSelected: 'No image selected',
      uploadedSuccessfully: 'Image uploaded successfully',
      uploadFailed: 'Upload failed',
    },
    level: {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    },
  },
  notification: {
    success: 'Success',
    error: 'Error',
    info: 'Information',
    warning: 'Warning',
  },
  header: {
    title: 'Orange Sec 🍊',
  },
  menu: {
    home: 'Home',
    wikiCenter: 'Wiki Center',
    vulWiki: 'Vulnerability Wiki',
    vulLibrary: 'Vulnerability Library',
    appLibrary: 'Application Library',
    taskDistribution: 'Task Distribution',
    vulCenter: 'Vulnerability Center',
    toolCollection: 'Tool Collection',
    systemSettings: 'System Settings',
  },
  footer: {
    text: 'Footer',
  },
  layouts: {
    wiki: {
      application: 'Application',
      vulnerability: 'Vulnerability',
    },
  },
  components: {
    wangEditor: {
      placeholder: 'Please enter content...',
      imageSizeLimit: 'Image cannot exceed 2MB!',
      uploadError: 'Upload failed',
    },
    newWindowButton: {
      openInNewWindow: 'Open in New Window',
      openFailed: 'Failed to open new window',
      electronOnly: 'This feature is only available in desktop application',
    },
    pocChecker: {
      testSite: 'Test Site',
      testSiteTooltip: 'Start with https:// or http://, default is http if protocol not specified',
      testSiteRequired: 'Test site cannot be empty',
      testSiteInputPlaceholder: 'Please enter test site',
      proxy: 'Proxy',
      proxyTooltip: 'Example: http://127.0.0.1:1080',
      proxyInputPlaceholder: 'Please enter proxy address',
      savePoc: 'Save Test Result',
      run: 'Run',
      testResult: 'Test Result:',
      vulExists: 'Vulnerability Exists',
      vulNotExists: 'Vulnerability Does Not Exist',
      step: 'Step',
      description: 'Description',
      path: 'Path',
      timeCost: 'Time Cost',
      milliseconds: 'ms',
      status: 'Status',
      serviceError: 'Service Error',
      executionFailed: 'Execution Failed',
      request: 'Request',
      response: 'Response',
      requestDetails: 'Request Details',
    },
    appSelector: {
      enterAppName: 'Enter application name',
      requestFailed: 'Request failed',
      requestError: 'Request error',
    },
    fileSelector: {
      selectFile: 'Select File',
      selectFilePlaceholder: 'Please select a file',
      electronOnly: 'This feature is only available in the desktop application',
      selectError: 'Failed to select file, please try again',
    },
    folderSelector: {
      selectFolder: 'Select Folder',
      selectFolderPlaceholder: 'Please select a folder path',
      electronOnly: 'This feature is only available in the desktop application',
      selectError: 'Failed to select folder, please try again',
    },
  },
  pages: {
    notesView: {
      title: 'Hello POC',
      defaultContent: 'Default Content',
    },
    appsView: {
      title: 'Hello App Page',
      show: 'Show',
    },
    home: {
      title: 'System Overview',
      subtitle: 'Real-time Monitoring and System Status',
      cpuUsage: 'CPU Usage',
      memoryUsage: 'Memory Usage',
      networkBandwidth: 'Network Bandwidth',
      goroutineCount: 'Goroutine Count',
      userManual: 'User Manual',
      disclaimer: 'Network Security Legal Notice and Disclaimer',
      importantNotice: 'Important Notice',
      securityNotice:
        'This tool is limited to authorized security testing and legal network security assessment activities.',
      legalStatement: 'Legal Statement',
      legalContent:
        'According to relevant laws and regulations such as the "Cybersecurity Law of the People\'s Republic of China" and the "Data Security Law", unauthorized security testing of network systems is illegal. Any test using this system must be explicitly authorized by the owner of the tested system.',
      disclaimerTitle: 'Disclaimer',
      disclaimerContent:
        'Users are responsible for all behaviors using this system. Developers are not responsible for any consequences caused by illegal use of this system. Please ensure that you fully understand the relevant laws and regulations and obtain necessary authorization before use.',
      disclaimerAgreed: 'I have read and agree to the above statement',
      loadingSample: 'Load Sample Content',
      loadingContent: 'User manual content loading...',
      systemInfoError: 'Failed to get system information',
      searchPlaceholder: 'Search for POCs, applications, or vulnerabilities...',
      searchResults: 'Search Results',
      pocResults: 'POC Results',
      appResults: 'Application Results',
      vulResults: 'Vulnerability Results',
      noResults: 'No matching results found',
      systemMetrics: 'System Metrics',
      viewMore: 'View More',
    },
    vul: {
      vulCount: 'Vulnerability Count',
      searchName: 'Search by vulnerability name',
      searchPocId: 'POC ID',
      searchTaskId: 'Task ID',
      searchCompany: 'Company Name',
      searchHost: 'Target Host',
      selectVulLevel: 'Select vulnerability level',
      selectVulType: 'Select vulnerability type',
      search: 'Search',
      addVul: 'Add Vulnerability',
      batchDelete: 'Batch Delete',
      confirmDelete: 'Confirm deleting vulnerabilities?',
      cancel: 'Cancel',
      confirm: 'Confirm',
      searchPath: 'Search by vulnerability path',
      searchParam: 'Search by vulnerability parameter',
      updateTimeGreater: 'Update time greater than',
      updateTimeLess: 'Update time less than',
      retest: 'Retest Vulnerability',
      deleteSuccess: 'Delete Successful',
      profile: {
        title: 'Vulnerability Details',
        basicInfo: 'Basic Information',
        siteInfo: 'Site Information',
        appInfo: 'Application Information',
        vulInfo: 'Vulnerability Information',
        taskInfo: 'Task Information',
        vulName: 'Vulnerability Name',
        vulId: 'Vulnerability ID',
        taskId: 'Task ID',
        taskName: 'Task Name',
        pocName: 'POC Name',
        vendor: 'Vendor',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        vulUrl: 'Vulnerability URL',
        targetInfo: 'Target Information',
        host: 'Host',
        domain: 'Domain',
        ipAddress: 'IP Address',
        icpNumber: 'ICP Number',
        icpName: 'ICP Name',
        companyInfo: 'Company Information',
        address: 'Address',
        companyCity: 'City',
        companyProvince: 'Province',
        industry: 'Industry',
        companyRegisterMoney: 'Registered Capital',
        baiduRank: 'Baidu Rank',
        yiDongRank: 'Mobile Rank',
        googleRank: 'Google Rank',
        siteRanks: 'Site Rankings',
        vulFlows: 'Vulnerability Traffic',
        vulConfirmed: 'Vulnerability Confirmed',
        back: 'Back',
        serviceError: 'Service Error',
        emptyVulId: 'Empty vulnerability ID, cannot view details',
        exportReport: 'Export Report',
        updateSiteInfo: 'Update Site Information',
        autoFillAssetInfo: 'Auto-fill',
        refresh: 'Refresh',
        save: 'Save',
        saveSuccess: 'Save Successful',
        saveSuccessDesc: 'Vulnerability information has been saved successfully',
        saveError: 'Save Failed',
        saveErrorDesc: 'An error occurred while saving vulnerability information',
        missingHostId: 'Missing host ID, cannot save site information',
        submit: 'Sync to Vulnerability Platform',
        submitSuccess: 'Submit Successful',
        submitSuccessDesc: 'Vulnerability information has been submitted successfully',
        submitError: 'Submit Failed',
        submitErrorDesc: 'An error occurred while submitting vulnerability information',
        siteAndAppInfo: 'Site & Application Information',
        assetImages: 'Asset Images',
        supplementaryImages: 'Supplementary Screenshots',
        addImage: 'Add Image',
        imageDesc: 'Image Description',
        upload: 'Upload',
        uploadSuccess: 'Upload Successful',
        uploadFailed: 'Upload Failed',
        uploadError: 'An error occurred during upload',
        imageUploadedSuccessfully: 'Image uploaded successfully',
        imageUploaded: 'Image Uploaded',
        pleaseAddDescription: 'Please add image description (optional)',
        uploadAssetImage: 'Upload Asset Image',
        uploadSupplementaryImage: 'Upload Supplementary Image',
        clickToUpload: 'Click to Upload Image',
        imageDescPlaceholder: 'Enter image description (optional)',
        invalidFileType: 'Invalid File Type',
        pleaseSelectImage: 'Please select an image file',
        deleteSuccess: 'Delete Successful',
        deleteFailed: 'Delete Failed',
        deleteError: 'An error occurred during deletion',
        imageDeletedSuccessfully: 'Image deleted successfully',
        noDescription: 'No description',
        missingInformation: 'Missing required information, cannot upload',
        orPasteImage: 'or paste image (Ctrl+V)',
        clipboardImage: 'Clipboard Image',
        imageFromClipboard: 'Image from clipboard has been loaded',
        appName: 'Application Name',
        appDesc: 'Application Description',
        pocDesc: 'POC Description',
        repairSuggestion: 'Repair Suggestion',
        updateSuccess: 'Update Successful',
        updateSuccessDesc: 'Vulnerability information has been successfully updated',
        updateFailed: 'Update Failed',
        updateError: 'An error occurred while updating information',
        reportNameUpdated: 'Report name has been updated',
        vulUrlUpdated: 'Vulnerability URL has been updated',
        featureNotImplemented: 'This feature is not implemented yet',
        selectVuls: 'Select Vulnerabilities',
        vulLoadFailed: 'Failed to load vulnerabilities',
        pleaseSelectVuls: 'Please select at least one vulnerability',
        exportFailed: 'Export Failed',
        exportStarted: 'Export Started',
        exportSuccess: 'The report export task will be generated in the background, please wait',
      },
      columns: {
        id: 'ID',
        vulName: 'Vulnerability Name',
        vendor: 'Vendor',
        vulUrl: 'Vulnerability URL',
        taskName: 'Task Name',
        pocName: 'POC Name',
        updateTime: 'Update Time',
        operations: 'Operations',
      },
    },
    task: {
      addScanTask: 'Add Scan Task',
      addTask: 'Add Task',
      taskName: 'Task Name',
      searchName: 'Task Name',
      searchStatus: 'Task Status',
      batchDelete: 'Batch Delete',
      confirmDelete: 'Confirm deleting task?',
      cancel: 'Cancel',
      confirm: 'Confirm',
      updateTimeGreater: 'Update time greater than',
      updateTimeLess: 'Update time less than',
      search: 'Search',
      deleteSuccess: 'Delete Successful',
      scanStartSuccess: 'Scan started successfully',
      scanStartFailed: 'Failed to start scan',
      scanPauseSuccess: 'Scan paused successfully',
      scanPauseFailed: 'Failed to pause scan',
      exportReport: 'Export Report',
      exportStarted: 'Export Started',
      exportSuccess: 'Report export successful, please check your local folder',
      exportFailed: 'Failed to export report',
      noTasksSelected: 'Please select at least one task',
      columns: {
        id: 'ID',
        taskName: 'Task Name',
        scanType: 'Scan Type',
        taskProgress: 'Task Progress',
        taskStatus: 'Task Status',
        executionTime: 'Execution Time',
        taskTarget: 'Task Target',
        targets: 'Target List',
        targetCount: 'Target Count',
        updateTime: 'Update Time',
        createTime: 'Create Time',
        operations: 'Operations',
      },
      status: {
        ready: 'Ready',
        gettingTargets: 'Getting Targets',
        targetsRetrieved: 'Targets Retrieved',
        scanning: 'Scanning',
        pausing: 'Pausing',
        paused: 'Paused',
        finished: 'Scan Completed',
        error: 'Scan Error',
        unknown: 'Unknown Status',
      },
      statusTips: {
        pausing: 'Pausing, please wait',
      },
      dashboard: {
        totalScans: 'Total Scans',
        scanning: 'Currently Scanning',
        paused: 'Tasks Paused',
        failed: 'Scan Failed',
        times: 'times',
      },
      add: {
        basicSettings: 'Task Basic Settings',
        targetSettings: 'Scan Target Settings',
        scanSettings: 'Scan Task Settings',
        burstSettings: 'Burst Task Settings',
        taskName: 'Task Name',
        taskNameRequired: 'Task name cannot be empty',
        enterTaskName: 'Please enter task name',
        taskNameTip: 'If not filled, system will generate a task name automatically',
        proxySettings: 'Proxy Settings',
        proxyExample: 'e.g. http://127.0.0.1:1080',
        enterProxyAddress: 'Please enter proxy address',
        concurrency: 'Concurrency',
        scanType: 'Scan Type',
        selectScanType: 'Please select scan type',
        pocScan: 'POC Scan',
        passwordBurst: 'Password Burst',
        manualInput: 'Manual Input',
        enterTargetsOneLine: 'Please enter targets, one per line',
        fileImport: 'File Import',
        enterFilePath: 'Please enter absolute file path',
        filePathExample: 'e.g. /data/targets.txt',
        selectTxtFile: 'Please select .txt file',
        autoSearch: 'Auto Search',
        autoSearchLimited:
          'Auto search is only available when selecting a single POC or application',
        saveSearchResults: 'Save Search Results',
        scanAllPoc: 'Scan All POC',
        selectApplication: 'Select Application',
        scanConfiguration: 'Scan Configuration',
        previousStep: 'Previous Step',
        nextStep: 'Next Step',
        addTask: 'Add Task',
        enterTarget: 'Please enter target',
        selectTargetFile: 'Please select target file',
        taskCreatedSuccess: 'Task created successfully',
        createFailed: 'Creation failed',
        fetchAppListFailed: 'Failed to fetch application list',
        fetchPocListFailed: 'Failed to fetch POC list',
        scanMode: 'Scan Mode',
        pocScanMode: 'POC Scan Mode',
        appScanMode: 'Application Scan Mode',
        selectPoc: 'Select POC',
        selectPocRequired: 'Please select at least one POC',
        selectAppRequired: 'Please select at least one application',
        searchEngines: 'Search Engines',
        selectSearchEngines: 'Please select search engines',
        selectSearchEngine: 'Please select at least one search engine',
      },
    },
    poc: {
      pocCount: 'POC Count',
      addPoc: 'Add POC',
      searchName: 'Vulnerability Name',
      searchVulType: 'Vulnerability Type',
      searchVulLevel: 'Vulnerability Level',
      searchParam: 'Vulnerability Parameter',
      updateTimeGreater: 'Update Time Greater',
      updateTimeLess: 'Update Time Less',
      search: 'Search',
      batchDelete: 'Batch Delete',
      confirmDelete: 'Confirm deleting POCs?',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      quickTest: 'Quick Test',
      columns: {
        id: 'ID',
        vulName: 'Vulnerability Name',
        vulType: 'Vulnerability Type',
        vulLevel: 'Vulnerability Level',
        vulPath: 'Vulnerability Path',
        vulParam: 'Vulnerability Parameter',
        updateTime: 'Update Time',
        operations: 'Operations',
      },
      profile: {
        title: 'POC Details',
        basicInfo: 'Basic Information',
        vulName: 'Vulnerability Name',
        vulId: 'Vulnerability ID',
        newPoc: 'New',
        vulType: 'Vulnerability Type',
        vulLevel: 'Vulnerability Level',
        application: 'Application',
        applicationRequired: 'Application binding cannot be empty',
        vendor: 'Vendor',
        version: 'Version',
        fofaFingerprint: 'FOFA Fingerprint',
        hunterFingerprint: 'Hunter Fingerprint',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        applicationDescription: 'Application Description',
        noDescription: 'No description available',
        vulDetail: 'Vulnerability Details',
        vulPath: 'Vulnerability Path',
        vulPathPlaceholder: 'e.g.: /api/v1/login',
        vulParam: 'Vulnerability Parameter',
        vulParamPlaceholder: 'e.g.: username, password',
        vulDescription: 'Vulnerability and Harm Description',
        vulDescriptionPlaceholder:
          'Please describe the vulnerability principle and potential harm...',
        repairSuggestion: 'Repair Suggestion',
        repairSuggestionPlaceholder: 'Please provide suggestions for fixing this vulnerability...',
        reproduceSteps: 'Reproduction Steps',
        detectionRule: 'Detection Rule',
        testRule: 'Test Rule',
        viewRule: 'View Rule',
        hideRule: 'Hide Rule',
        cancel: 'Cancel',
        save: 'Save',
        updateSuccess: 'Successfully Updated',
        updateSuccessDesc: 'POC information has been successfully updated',
        close: 'Close',
        ruleTest: 'Rule Test',
        serviceError: 'Service Error',
        updateFailed: 'Update Failed',
        exportReportConfig: 'Export Report Configuration',
        includeFofaAsset: 'Include FOFA Asset Proof',
        includeReproduceSteps: 'Include Detailed Reproduction Steps',
        includeVulReport: 'Include Vulnerability Report',
        selectVuls: 'Select Vulnerabilities',
        confirmExport: 'Confirm Export',
        exportStarted: 'Export Started',
        exportSuccess:
          'The report will be generated in the background and you will be notified when completed',
        vulLoadFailed: 'Failed to load vulnerabilities',
        pleaseSelectVuls: 'Please select at least one vulnerability',
        exportFailed: 'Export failed',
      },
      add: {
        title: 'Add POC',
        pocName: 'POC Name',
        pocNamePlaceholder: 'Leave blank for auto-fill',
        vulLevel: 'Vulnerability Level',
        vulLevelRequired: 'Vulnerability level cannot be empty',
        bindApp: 'Bind Application',
        vulType: 'Vulnerability Type',
        vulTypeRequired: 'Vulnerability type cannot be empty',
        vulPathRequired: 'Vulnerability path cannot be empty',
        vulDescription: 'Vulnerability Description',
        vulDescriptionRequired: 'Vulnerability description cannot be empty',
        repairSuggestionRequired: 'Repair suggestion cannot be empty',
        add: 'Add',
        createSuccess: 'Create Successful',
        keepAndContinue: 'Keep and Continue Adding',
        continueAdd: 'Continue Adding',
        finish: 'Finish',
        createFailed: 'Creation Failed',
      },
    },
    app: {
      list: {
        appCount: 'App Count',
        searchName: 'Search by app name',
        searchVersion: 'Search by app version',
        search: 'Search',
        refresh: 'Refresh',
        addApp: 'Add Application',
        import: 'Import',
        export: 'Export',
        batchDelete: 'Batch Delete',
        confirmDelete: 'Confirm deleting applications?',
        confirmDeleteMessage: 'Are you sure you want to delete the selected applications?',
        cancel: 'Cancel',
        confirm: 'Confirm',
        gitee: 'Gitee',
        github: 'Github',
        importTitle: 'Import Applications',
        importAutoSync: 'Auto Sync',
        importFromFolder: 'Import from Folder',
        importFromFile: 'Import from File',
        importSyncSource: 'Sync Source',
        autoSyncDescription:
          'Applications will be automatically synced from the official repository, this may take some time',
        importFolderDescription:
          'Import applications from a local folder containing application configuration files',
        importFileDescription: 'Import applications from a local .oapp file',
        selectFolderPlaceholder: 'Please select a folder with application configs',
        selectFilePlaceholder: 'Please select a .oapp format file',
        importDuplicateHandle: 'Duplicate Import Handling',
        importUpdate: 'Update existing apps',
        importSkip: 'Skip existing apps',
        startImport: 'Start Import',
        importSuccess: 'Import Successful',
        exportTitle: 'Export Applications',
        exportAll: 'Export All Applications',
        selectAppsToExport: 'Select Applications to Export',
        selectAppsPlaceholder: 'Please select applications to export',
        startExport: 'Start Export',
        noAppsSelected: 'Please select at least one application',
        exportSuccess: 'Export Successful',
        exportFailed: 'Export Failed',
        columns: {
          id: 'ID',
          appName: 'App Name',
          version: 'Version',
          pocCount: 'POC Count',
          fofaFingerprint: 'FOFA Fingerprint',
          hunterFingerprint: 'HUNTER Fingerprint',
          updateTime: 'Update Time',
          operations: 'Operations',
        },
        deleteSuccess: 'Delete Successful',
        emptyAppIdError: 'App ID is empty, view failed',
      },
      profile: {
        title: 'Application Details',
        basicInfo: 'Basic Information',
        appName: 'Application Name',
        enterAppName: 'Please enter application name',
        appId: 'Application ID',
        new: 'New',
        version: 'Version',
        enterVersion: 'Please enter version number',
        vendor: 'Vendor',
        enterVendor: 'Please enter vendor name',
        fofaFingerprint: 'FOFA Fingerprint',
        enterFofaFingerprint: 'Please enter FOFA fingerprint',
        hunterFingerprint: 'Hunter Fingerprint',
        enterHunterFingerprint: 'Please enter Hunter fingerprint',
        systemInfo: 'System Information',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        appDescription: 'Application Description',
        enterAppDescription: 'Please enter detailed description of the application...',
        cancel: 'Cancel',
        save: 'Save',
        pocList: 'Related POC List',
        serviceError: 'Service Error',
        requestFailed: 'Request Failed',
        updateSuccess: 'Update Successful',
        updateFailed: 'Update Failed',
      },
      add: {
        appName: 'Application Name',
        appVersion: 'Application Version',
        companyName: 'Company Name',
        hunterFingerprint: 'Hunter Fingerprint',
        fofaFingerprint: 'FOFA Fingerprint',
        appDescription: 'Application Description',
        add: 'Add',
        createFailed: 'Creation Failed',
        createSuccess: 'Create Successful',
      },
    },
    tools: {
      title: 'Tools Collection',
      subtitle: 'Practical Security Tools',
      calculator: {
        title: 'Calculator',
        description: 'A simple calculator for basic arithmetic operations',
        firstNumber: 'First Number',
        secondNumber: 'Second Number',
        calculate: 'Calculate',
        result: 'Result',
        enterBothNumbers: 'Please enter both numbers',
        divideByZero: 'Cannot divide by zero',
      },
      webRequester: {
        title: 'Web Requester',
        send: 'Send',
        request: 'Request Data',
        response: 'Response Data',
        noResponse: 'No response data yet, please send a request first',
        requestSuccess: 'Request sent successfully',
        requestFailed: 'Request failed',
        enableProxy: 'Enable Proxy',
        useProxy: 'Proxy Address',
        urlRequired: 'Please enter URL',
      },
      encoderTool: {
        title: 'Encoder Tool',
        description: 'Encode and decode text in various formats',
        inputText: 'Input Text',
        inputPlaceholder: 'Enter text to encode or decode...',
        outputText: 'Output Text',
        outputPlaceholder: 'Encoded or decoded output will appear here...',
        encode: 'Encode',
        decode: 'Decode',
        encrypt: 'Encrypt',
        copyToClipboard: 'Copy to Clipboard',
        clear: 'Clear',
        noInputText: 'Please enter text to encode or decode',
        noOutputToCopy: 'No output to copy',
        copiedToClipboard: 'Copied to clipboard',
        failedToCopy: 'Failed to copy',
        textCleared: 'Text cleared',
        desKeyPlaceholder: 'Enter DES key (8 characters)...',
      },
      formatter: {
        title: 'Encoder Tool',
        description: 'Encode and decode text in various formats',
        inputText: 'Input Text',
        inputPlaceholder: 'Enter text to encode or decode...',
        outputText: 'Output Text',
        outputPlaceholder: 'Encoded or decoded output will appear here...',
        encode: 'Encode',
        decode: 'Decode',
        encrypt: 'Encrypt',
        copyToClipboard: 'Copy to Clipboard',
        clear: 'Clear',
        noInputText: 'Please enter text to encode or decode',
        noOutputToCopy: 'No output to copy',
        copiedToClipboard: 'Copied to clipboard',
        failedToCopy: 'Failed to copy',
        textCleared: 'Text cleared',
        desKeyPlaceholder: 'Enter DES key (8 characters)...',
      },
      portScanner: {
        title: 'Port & Fingerprint Scanner',
      },
      pathScanner: {
        title: 'Sensitive Path Scanner',
      },
      cryptoTool: {
        title: 'Crypto Tool',
        description: 'Encrypt and decrypt data with various algorithms',
        inputText: 'Input Text',
        outputText: 'Output Text',
        encrypt: 'Encrypt',
        hash: 'Hash',
        secretKey: 'Secret Key',
        encryptionKey: 'Encryption Key',
        desKeyPlaceholder: 'Enter DES key (8 characters)...',
        selectHashMethod: 'Select hash method...',
        selectEncryptionMethod: 'Select encryption method...',
        selectDecryptionMethod: 'Select decryption method...',
        noInputText: 'Please enter text to encrypt or decrypt',
        keyRequired: 'Encryption key is required',
        secretKeyRequired: 'Secret key is required for HMAC',
        ivRequired: 'Initialization Vector (IV) is required for this mode',
        encryptionFailed: 'Encryption failed',
        decryptionFailed: 'Decryption failed',
        hashGenerated: 'Hash Generated',
        encryptedSuccessfully: 'Encrypted successfully',
        decryptedSuccessfully: 'Decrypted successfully',
        ecbMode: 'ECB Mode',
        cbcMode: 'CBC Mode',
        cfbMode: 'CFB Mode',
        ofbMode: 'OFB Mode',
        ctrMode: 'CTR Mode',
        ivInputPlaceholder: 'IV (Initialization Vector)',
        symmetricEncryption: 'Symmetric Encryption',
        copyToClipboard: 'Copy to Clipboard',
        clear: 'Clear',
        noOutputToCopy: 'No output to copy',
        copiedToClipboard: 'Copied to clipboard',
        failedToCopy: 'Failed to copy',
        textCleared: 'Text cleared',
      },
      jwtTester: {
        title: 'JWT Security Tester',
      },
      dictGenerator: {
        title: 'Dictionary Generator',
      },
      passwordScanner: {
        title: 'Password Scanner',
        description: 'Scan and verify weak passwords in various services',
        configPanel: 'Configuration Panel',
        modelType: 'Service Type',
        selectModel: 'Please select service type',
        targetHost: 'Target Host',
        enterHost: 'Please enter host address',
        port: 'Port',
        enterPort: 'Please enter port',
        timeout: 'Timeout (seconds)',
        enterTimeout: 'Please enter timeout',
        username: 'Username',
        enterUsername: 'Please enter username (optional)',
        password: 'Password',
        enterPassword: 'Please enter password (optional)',
        startCheck: 'Start Verification',
        reset: 'Reset',
        results: 'Verification Results',
        noResults: 'No verification performed or no results',
        errorOccurred: 'Error Occurred',
        weakPasswordFound: 'Weak Password Found',
        passwordSecure: 'No Weak Password Found',
        serviceType: 'Service Type',
        checkCompleteWeakFound: 'Verification complete, weak password found',
        checkCompleteNoWeak: 'Verification complete, no weak password found',
        modelRequired: 'Please select service type',
        hostRequired: 'Please enter target host',
        validPortRequired: 'Please enter valid port (1-65535)',
      },
    },
    system: {
      title: 'System Configuration',
      systemInfo: 'System Information',
      engineVersion: 'Engine Version',
      searchEngineConfig: 'Search Engine Configuration',
      fofaConfig: 'FOFA Configuration',
      fofaApiKey: 'FOFA API Key',
      enterFofaApiKey: 'Please enter FOFA API Key',
      hunterConfig: 'Hunter Configuration',
      hunterApiKey: 'Hunter API Key',
      enterHunterApiKey: 'Please enter Hunter API Key',
      aiZhanConfig: 'AiZhan Configuration',
      aiZhanToken: 'AiZhan Token',
      enterAiZhanToken: 'Please enter AiZhan Token',
      aiZhanTokenHelp: 'Click to get token',
      limitMaxCount: 'Limit Maximum Count',
      enterMaxCount: 'Please enter maximum count',
      valueRange: 'Value range: 1~10000',
      folderPathConfig: 'Folder Path Configuration',
      siteCollectFolder: 'Site Collection Folder',
      reportExportFolder: 'Report Export Folder',
      appExportFolder: 'APP Export Folder',
      languageSettings: 'Language Settings',
      selectLanguage: 'Select Language',
      saveConfig: 'Save Configuration',
      reset: 'Reset',
      getConfigFailed: 'Failed to get system configuration',
      saveConfigFailed: 'Failed to save configuration',
      saveConfigSuccess: 'Configuration saved successfully',
      updateFofaConfigSuccess: 'FOFA configuration updated successfully',
      updateFofaConfigFailed: 'Failed to update FOFA configuration',
      updateHunterConfigSuccess: 'Hunter configuration updated successfully',
      updateHunterConfigFailed: 'Failed to update Hunter configuration',
      updateAiZhanConfigSuccess: 'AiZhan configuration updated successfully',
      updateAiZhanConfigFailed: 'Failed to update AiZhan configuration',
      updateFolderConfigSuccess: 'Folder configuration updated successfully',
      updateFolderConfigFailed: 'Failed to update folder configuration',
    },
  },
  brand: {
    name: 'Orange Sec Kit 🍊',
    description:
      'All-in-one vulnerability management, helping security professionals efficiently solve vulnerability verification and report delivery',
  },
}
