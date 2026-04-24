(() => {
  // js/constants.js
  var SCRIPT = {
    name: "\u6697\u6D41\u6D8C\u52A8",
    roles: [
      { "id": "1_22", "name": "\u6D17\u8863\u5987", "team": "townsfolk", "ability": "\u5728\u4F60\u7684\u9996\u4E2A\u591C\u665A\uFF0C\u4F60\u4F1A\u5F97\u77E5\u4E24\u540D\u73A9\u5BB6\u548C\u4E00\u4E2A\u9547\u6C11\u89D2\u8272\uFF1A\u8FD9\u4E24\u540D\u73A9\u5BB6\u4E4B\u4E00\u662F\u8BE5\u89D2\u8272\u3002" },
      { "id": "1_21", "name": "\u56FE\u4E66\u7BA1\u7406\u5458", "team": "townsfolk", "ability": "\u5728\u4F60\u7684\u9996\u4E2A\u591C\u665A\uFF0C\u4F60\u4F1A\u5F97\u77E5\u4E24\u540D\u73A9\u5BB6\u548C\u4E00\u4E2A\u5916\u6765\u8005\u89D2\u8272\uFF1A\u8FD9\u4E24\u540D\u73A9\u5BB6\u4E4B\u4E00\u662F\u8BE5\u89D2\u8272\uFF08\u6216\u8005\u4F60\u4F1A\u5F97\u77E5\u6CA1\u6709\u5916\u6765\u8005\u5728\u573A\uFF09\u3002" },
      { "id": "1_20", "name": "\u8C03\u67E5\u5458", "team": "townsfolk", "ability": "\u5728\u4F60\u7684\u9996\u4E2A\u591C\u665A\uFF0C\u4F60\u4F1A\u5F97\u77E5\u4E24\u540D\u73A9\u5BB6\u548C\u4E00\u4E2A\u722A\u7259\u89D2\u8272\uFF1A\u8FD9\u4E24\u540D\u73A9\u5BB6\u4E4B\u4E00\u662F\u8BE5\u89D2\u8272\uFF08\u6216\u8005\u4F60\u4F1A\u5F97\u77E5\u6CA1\u6709\u722A\u7259\u5728\u573A\uFF09\u3002" },
      { "id": "1_19", "name": "\u53A8\u5E08", "team": "townsfolk", "ability": "\u5728\u4F60\u7684\u9996\u4E2A\u591C\u665A\uFF0C\u4F60\u4F1A\u5F97\u77E5\u573A\u4E0A\u90BB\u5EA7\u7684\u90AA\u6076\u73A9\u5BB6\u6709\u591A\u5C11\u5BF9\u3002" },
      { "id": "1_18", "name": "\u5171\u60C5\u8005", "team": "townsfolk", "ability": "\u6BCF\u4E2A\u591C\u665A\uFF0C\u4F60\u4F1A\u5F97\u77E5\u4E0E\u4F60\u90BB\u8FD1\uFF08\u5373\u5DE6\u53F3\u4E24\u8FB9\uFF09\u7684\u4E24\u540D\u5B58\u6D3B\u7684\u73A9\u5BB6\u4E2D\u90AA\u6076\u73A9\u5BB6\u7684\u6570\u91CF\u3002" },
      { "id": "1_17", "name": "\u5360\u535C\u5E08", "team": "townsfolk", "ability": "\u6BCF\u4E2A\u591C\u665A\uFF0C\u4F60\u8981\u9009\u62E9\u4E24\u540D\u73A9\u5BB6\uFF1A\u4F60\u4F1A\u5F97\u77E5\u4ED6\u4EEC\u4E4B\u4E2D\u662F\u5426\u6709\u6076\u9B54\u3002\u4F1A\u6709\u4E00\u540D\u5584\u826F\u73A9\u5BB6\u59CB\u7EC8\u88AB\u4F60\u7684\u80FD\u529B\u5F53\u4F5C\u6076\u9B54(\u5E72\u6270\u9879)\u3002" },
      { "id": "1_16", "name": "\u9001\u846C\u8005", "team": "townsfolk", "ability": "\u6BCF\u4E2A\u591C\u665A\uFF08\u4E0D\u5305\u542B\u9996\u591C\uFF09\uFF0C\u4F60\u4F1A\u5F97\u77E5\u4ECA\u5929\u767D\u5929\u6B7B\u4E8E\u5904\u51B3\u7684\u73A9\u5BB6\u7684\u89D2\u8272\u3002" },
      { "id": "1_15", "name": "\u50E7\u4FA3", "team": "townsfolk", "ability": "\u6BCF\u4E2A\u591C\u665A\uFF08\u4E0D\u5305\u542B\u9996\u591C\uFF09\uFF0C\u4F60\u8981\u9009\u62E9\u9664\u4F60\u4EE5\u5916\u7684\u4E00\u540D\u73A9\u5BB6\uFF1A\u5F53\u665A\u6076\u9B54\u7684\u8D1F\u9762\u80FD\u529B\u5BF9\u4ED6\u65E0\u6548\u3002" },
      { "id": "1_14", "name": "\u5B88\u9E26\u4EBA", "team": "townsfolk", "ability": "\u5982\u679C\u4F60\u5728\u591C\u665A\u6B7B\u4EA1\uFF0C\u4F60\u4F1A\u88AB\u5524\u9192\uFF0C\u7136\u540E\u4F60\u8981\u9009\u62E9\u4E00\u540D\u73A9\u5BB6\uFF1A\u4F60\u4F1A\u5F97\u77E5\u4ED6\u7684\u89D2\u8272\u3002" },
      { "id": "1_13", "name": "\u8D1E\u6D01\u8005", "team": "townsfolk", "ability": "\u5F53\u4F60\u9996\u6B21\u88AB\u63D0\u540D\u65F6\uFF0C\u5982\u679C\u63D0\u540D\u4F60\u7684\u73A9\u5BB6\u662F\u9547\u6C11\uFF0C\u4ED6\u7ACB\u523B\u88AB\u5904\u51B3\u3002" },
      { "id": "1_12", "name": "\u730E\u624B", "team": "townsfolk", "ability": "\u6BCF\u5C40\u6E38\u620F\u9650\u4E00\u6B21\uFF0C\u4F60\u53EF\u4EE5\u5728\u767D\u5929\u65F6\u516C\u5F00\u9009\u62E9\u4E00\u540D\u73A9\u5BB6\uFF1A\u5982\u679C\u4ED6\u662F\u6076\u9B54\uFF0C\u4ED6\u6B7B\u4EA1\u3002" },
      { "id": "1_11", "name": "\u58EB\u5175", "team": "townsfolk", "ability": "\u6076\u9B54\u7684\u8D1F\u9762\u80FD\u529B\u5BF9\u4F60\u65E0\u6548\u3002" },
      { "id": "1_10", "name": "\u9547\u957F", "team": "townsfolk", "ability": "\u5982\u679C\u53EA\u6709\u4E09\u540D\u73A9\u5BB6\u5B58\u6D3B\u4E14\u767D\u5929\u6CA1\u6709\u4EBA\u88AB\u5904\u51B3\uFF0C\u4F60\u7684\u9635\u8425\u83B7\u80DC\uFF08\u9547\u957F\u65E5\uFF09\u3002\u5982\u679C\u4F60\u5728\u591C\u665A\u5373\u5C06\u6B7B\u4EA1\uFF0C\u53EF\u80FD\u4F1A\u6709\u4E00\u540D\u5176\u4ED6\u73A9\u5BB6\u4EE3\u66FF\u4F60\u6B7B\u4EA1\u3002" },
      { "id": "1_9", "name": "\u7BA1\u5BB6", "team": "outsider", "ability": "\u6BCF\u4E2A\u591C\u665A\uFF0C\u4F60\u8981\u9009\u62E9\u9664\u4F60\u4EE5\u5916\u7684\u4E00\u540D\u73A9\u5BB6(\u4E3B\u4EBA)\uFF1A\u660E\u5929\u767D\u5929\uFF0C\u53EA\u6709\u4ED6\u6295\u7968\u65F6\u4F60\u624D\u80FD\u6295\u7968\u3002" },
      { "id": "1_8", "name": "\u9152\u9B3C", "team": "outsider", "ability": "\u4F60\u4E0D\u77E5\u9053\u4F60\u662F\u9152\u9B3C\u3002\u4F60\u4EE5\u4E3A\u4F60\u662F\u4E00\u4E2A\u9547\u6C11\u89D2\u8272\uFF0C\u4F46\u5176\u5B9E\u4F60\u4E0D\u662F\u3002\u9152\u9B3C\u5B9E\u9645\u4E0A\u6CA1\u6709\u4EFB\u4F55\u80FD\u529B\u3002\u8BF4\u4E66\u4EBA\u4F1A\u88C5\u4F5C\u9152\u9B3C\u73A9\u5BB6\u662F\u4ED6\u4EE5\u4E3A\u7684\u90A3\u79CD\u9547\u6C11\u3002\u5982\u679C\u90A3\u4E2A\u9547\u6C11\u4F1A\u5728\u591C\u665A\u9192\u6765\uFF0C\u9152\u9B3C\u540C\u6837\u4F1A\u88AB\u5524\u9192\u5E76\u5982\u540C\u90A3\u4E2A\u9547\u6C11\u7684\u65B9\u5F0F\u8FDB\u884C\u884C\u52A8\u3002\u5982\u679C\u90A3\u4E2A\u9547\u6C11\u80FD\u591F\u83B7\u53D6\u4FE1\u606F\uFF0C\u8BF4\u4E66\u4EBA\u7167\u6837\u4F1A\u7ED9\u4ED6\u4FE1\u606F\uFF0C\u4F46\u662F\u4FE1\u606F\u53EF\u80FD\u9519\u8BEF\u3002" },
      { "id": "1_7", "name": "\u964C\u5BA2", "team": "outsider", "ability": "\u4F60\u53EF\u80FD\u4F1A\u88AB\u5F53\u4F5C\u90AA\u6076\u9635\u8425\u3001\u722A\u7259\u89D2\u8272\u6216\u6076\u9B54\u89D2\u8272\uFF0C\u5373\u4F7F\u4F60\u5DF2\u6B7B\u4EA1\u3002" },
      { "id": "1_6", "name": "\u5723\u5F92", "team": "outsider", "ability": "\u5982\u679C\u4F60\u6B7B\u4E8E\u5904\u51B3\uFF0C\u4F60\u7684\u9635\u8425\u843D\u8D25\u3002" },
      { "id": "1_5", "name": "\u6295\u6BD2\u8005", "team": "minion", "ability": "\u6BCF\u4E2A\u591C\u665A\uFF0C\u4F60\u8981\u9009\u62E9\u4E00\u540D\u73A9\u5BB6\uFF1A\u4ED6\u5728\u5F53\u665A\u548C\u660E\u5929\u767D\u5929\u4E2D\u6BD2\u3002" },
      { "id": "1_4", "name": "\u95F4\u8C0D", "team": "minion", "ability": "\u6BCF\u4E2A\u591C\u665A\uFF0C\u4F60\u80FD\u67E5\u770B\u9B54\u5178\u3002\u4F60\u53EF\u80FD\u4F1A\u88AB\u5F53\u4F5C\u5584\u826F\u9635\u8425\uFF0C\u9547\u6C11\u89D2\u8272\u6216\u5916\u6765\u8005\u89D2\u8272\uFF0C\u5373\u4F7F\u4F60\u5DF2\u6B7B\u4EA1\u3002" },
      { "id": "1_3", "name": "\u7EA2\u5507\u5973\u90CE", "team": "minion", "ability": "\u5982\u679C\u5927\u4E8E\u7B49\u4E8E\u4E94\u540D\u73A9\u5BB6\u5B58\u6D3B\u65F6\uFF08\u65C5\u884C\u8005\u4E0D\u8BA1\u7B97\u5728\u5185\uFF09\u6076\u9B54\u6B7B\u4EA1\uFF0C\u4F60\u53D8\u6210\u90A3\u4E2A\u6076\u9B54\u3002" },
      { "id": "1_2", "name": "\u7537\u7235", "team": "minion", "ability": "\u4F1A\u6709\u989D\u5916\u7684\u5916\u6765\u8005\u5728\u573A\u3002[+2 \u5916\u6765\u8005]" },
      { "id": "1_1", "name": "\u5C0F\u6076\u9B54", "team": "demon", "ability": "\u6BCF\u4E2A\u591C\u665A\uFF08\u4E0D\u5305\u542B\u9996\u591C\uFF09\uFF0C\u4F60\u8981\u9009\u62E9\u4E00\u540D\u73A9\u5BB6\uFF1A\u4ED6\u6B7B\u4EA1\u3002\u5982\u679C\u4F60\u4EE5\u8FD9\u79CD\u65B9\u5F0F\u81EA\u6740\uFF0C\u4E00\u540D\u722A\u7259\u4F1A\u53D8\u6210\u5C0F\u6076\u9B54\u3002" }
    ]
  };
  var ROLE_NAME_LIST = SCRIPT.roles.map((role) => role.name).sort((a, b) => b.length - a.length);
  var PLAYER_DISTRIBUTION = {
    5: { townsfolk: 3, outsider: 0, minion: 1, demon: 1 },
    6: { townsfolk: 3, outsider: 1, minion: 1, demon: 1 },
    7: { townsfolk: 5, outsider: 0, minion: 1, demon: 1 },
    8: { townsfolk: 5, outsider: 1, minion: 1, demon: 1 },
    9: { townsfolk: 5, outsider: 2, minion: 1, demon: 1 },
    10: { townsfolk: 7, outsider: 0, minion: 2, demon: 1 },
    11: { townsfolk: 7, outsider: 1, minion: 2, demon: 1 },
    12: { townsfolk: 7, outsider: 2, minion: 2, demon: 1 },
    13: { townsfolk: 9, outsider: 0, minion: 3, demon: 1 },
    14: { townsfolk: 9, outsider: 1, minion: 3, demon: 1 },
    15: { townsfolk: 9, outsider: 2, minion: 3, demon: 1 }
  };
  var ROLE_HINTS = {
    "\u6D17\u8863\u5987": "\u9996\u591C\u5F97\u77E5\u4E24\u540D\u73A9\u5BB6\u4E0E\u4E00\u4E2A\u9547\u6C11\u89D2\u8272\uFF1A\u5176\u4E2D\u4E00\u4EBA\u662F\u8BE5\u89D2\u8272\u3002",
    "\u56FE\u4E66\u7BA1\u7406\u5458": "\u9996\u591C\u5F97\u77E5\u4E24\u540D\u73A9\u5BB6\u4E0E\u4E00\u4E2A\u5916\u6765\u8005\u89D2\u8272\uFF0C\u5176\u4E2D\u4E00\u4EBA\u662F\u8BE5\u5916\u6765\u8005\uFF1B\u6216\u5F97\u77E5\u6CA1\u6709\u5916\u6765\u8005\u3002",
    "\u8C03\u67E5\u5458": "\u9996\u591C\u5F97\u77E5\u4E24\u540D\u73A9\u5BB6\u4E0E\u4E00\u4E2A\u722A\u7259\u89D2\u8272\uFF1A\u5176\u4E2D\u4E00\u4EBA\u662F\u8BE5\u722A\u7259\u3002",
    "\u53A8\u5E08": "\u9996\u591C\u5F97\u77E5\u76F8\u90BB\u90AA\u6076\u73A9\u5BB6\u7684\u5BF9\u6570\uFF08\u53EF\u80FD\u53D7\u964C\u5BA2/\u95F4\u8C0D\u5F71\u54CD\uFF09\u3002",
    "\u5171\u60C5\u8005": "\u6BCF\u665A\u5F97\u77E5\u76F8\u90BB\uFF08\u5373\u5DE6\u53F3\u4E24\u8FB9\uFF09\u5B58\u6D3B\u73A9\u5BB6\u4E2D\u7684\u90AA\u6076\u4EBA\u6570\uFF080/1/2\uFF09\u3002",
    "\u5360\u535C\u5E08": "\u5360\u535C\u5E08\uFF1A\u6BCF\u665A\u9009\u4E24\u4EBA\u5F97\u77E5\u662F\u5426\u6709\u6076\u9B54\uFF1B\u6709\u4E00\u540D\u597D\u4EBA\u4F1A\u88AB\u89C6\u4E3A\u6076\u9B54\uFF08\u5E72\u6270\u9879\uFF09\u3002",
    "\u9001\u846C\u8005": "\u6BCF\u4E2A\u591C\u665A\uFF08\u4E0D\u5305\u542B\u9996\u591C\uFF09\u82E5\u767D\u5929\u6709\u4EBA\u88AB\u5904\u51B3\uFF0C\u5F97\u77E5\u5176\u89D2\u8272\u3002",
    "\u50E7\u4FA3": "\u6BCF\u4E2A\u591C\u665A\uFF08\u4E0D\u5305\u542B\u9996\u591C\uFF09\u9009\u62E9\u4E00\u540D\u5176\u4ED6\u73A9\u5BB6\uFF0C\u4F7F\u5176\u5F53\u665A\u4E0D\u4F1A\u88AB\u6076\u9B54\u5200\u6B7B\u3002",
    "\u5B88\u9E26\u4EBA": "\u82E5\u591C\u665A\u6B7B\u4EA1\uFF0C\u88AB\u5524\u9192\u67E5\u4E00\u540D\u73A9\u5BB6\u7684\u89D2\u8272\u3002",
    "\u8D1E\u6D01\u8005": "\u9996\u6B21\u88AB\u63D0\u540D\u4E14\u63D0\u540D\u8005\u4E3A\u9547\u6C11\u65F6\uFF0C\u63D0\u540D\u8005\u88AB\u5904\u51B3\u3002",
    "\u730E\u624B": "\u6BCF\u5C40\u9650\u4E00\u6B21\uFF0C\u767D\u5929\u516C\u5F00\u9009\u62E9\u4E00\u540D\u73A9\u5BB6\uFF1B\u82E5\u5176\u4E3A\u6076\u9B54\u5219\u5176\u6B7B\u4EA1\u3002",
    "\u58EB\u5175": "\u4E0D\u4F1A\u6B7B\u4E8E\u6076\u9B54\u7684\u5200\u3002",
    "\u9547\u957F": "\u4EC5\u52693\u4EBA\u4E14\u767D\u5929\u65E0\u4EBA\u5904\u51B3\u65F6\u5584\u826F\u83B7\u80DC\uFF08\u9547\u957F\u65E5\uFF09\uFF1B\u591C\u665A\u53EF\u80FD\u66FF\u6B7B\u3002",
    "\u7BA1\u5BB6": "\u6BCF\u665A\u9009\u4E3B\u4EBA\uFF1B\u6B21\u65E5\u82E5\u4E0D\u4E0E\u4E3B\u4EBA\u540C\u7968\u5219\u65E0\u6CD5\u6295\u7968\u3002",
    "\u9152\u9B3C": "\u4EE5\u4E3A\u81EA\u5DF1\u662F\u67D0\u4E2A\u9547\u6C11\uFF0C\u4F46\u5B9E\u9645\u4E0D\u662F\uFF1B\u6280\u80FD\u4E00\u5B9A\u5931\u6548\uFF0C\u4FE1\u606F\u53EF\u80FD\u9519\u8BEF\u3002",
    "\u964C\u5BA2": "\u53EF\u80FD\u88AB\u5F53\u4F5C\u722A\u7259/\u6076\u9B54\uFF1B\u9635\u8425\u53EF\u80FD\u88AB\u89C6\u4E3A\u90AA\u6076\uFF08\u5373\u4F7F\u4F60\u5DF2\u6B7B\u4EA1\uFF09\u3002",
    "\u5723\u5F92": "\u82E5\u88AB\u5904\u51B3\uFF0C\u5584\u826F\u9635\u8425\u7ACB\u523B\u5931\u8D25\u3002",
    "\u6295\u6BD2\u8005": "\u6BCF\u665A\u9009\u62E9\u4E00\u540D\u73A9\u5BB6\u4E2D\u6BD2\uFF0C\u4ECA\u665A\u4E0E\u660E\u5929\u767D\u5929\u5176\u6280\u80FD\u4E00\u5B9A\u5931\u6548\uFF0C\u4FE1\u606F\u53EF\u80FD\u9519\u8BEF\u3002",
    "\u95F4\u8C0D": "\u6BCF\u665A\u53EF\u67E5\u770B\u9B54\u5178\uFF1B\u53EF\u80FD\u88AB\u89C6\u4E3A\u5584\u826F\u9635\u8425\u7684\u9547\u6C11\u6216\u5916\u6765\u8005\uFF08\u5373\u4F7F\u6B7B\u4EA1\uFF09\u3002",
    "\u7EA2\u5507\u5973\u90CE": "\u82E5\u5B58\u6D3B\u73A9\u5BB6\u4EBA\u6570>=5\u4E14\u5C0F\u6076\u9B54\u6B7B\u4EA1\uFF0C\u4F60\u6210\u4E3A\u5C0F\u6076\u9B54\u3002",
    "\u7537\u7235": "\u6E38\u620F\u4E2D\u591A\u51FA2\u540D\u5916\u6765\u8005\uFF08\u66FF\u63892\u4E2A\u9547\u6C11\uFF09\u3002",
    "\u5C0F\u6076\u9B54": "\u6BCF\u665A\uFF08\u4E0D\u5305\u542B\u9996\u591C\uFF09\u9009\u62E9\u4E00\u540D\u73A9\u5BB6\uFF0C\u4ED6\u6B7B\u4EA1\uFF1B\u82E5\u81EA\u6740\u5219\u4E00\u540D\u722A\u7259\u6210\u4E3A\u5C0F\u6076\u9B54\u3002"
  };
  var ROLE_STRATEGY_TIPS = {
    "\u6D17\u8863\u5987": "\u5EFA\u7ACB\u786E\u8BA4\u94FE\uFF0C\u907F\u514D\u9996\u65E5\u76F4\u63A5\u70B9\u540D\uFF0C\u53EF\u5148\u8F6F\u62A5\u6216\u79C1\u804A\u6838\u5B9E\uFF1B\u4FE1\u606F\u5DF2\u516C\u5F00\u6216\u81EA\u8EAB\u4EF7\u503C\u4E0D\u9AD8\u65F6\u53EF\u8003\u8651\u63A5\u53D7\u5904\u51B3\u3002",
    "\u56FE\u4E66\u7BA1\u7406\u5458": "\u5173\u6CE8\u5916\u6765\u8005\u6570\u91CF\u4E0E\u7537\u7235\u53EF\u80FD\uFF1B\u53EF\u7528\u6765\u5B9A\u4F4D\u9152\u9B3C\uFF1B\u4FE1\u606F\u5DF2\u516C\u5F00\u6216\u81EA\u8EAB\u4EF7\u503C\u4E0D\u9AD8\u65F6\u53EF\u8003\u8651\u63A5\u53D7\u5904\u51B3\u3002",
    "\u8C03\u67E5\u5458": "\u4F18\u5148\u5904\u7406\u547D\u4E2D\u5BF9\u4E2D\u7684\u9AD8\u5371\u722A\u7259\uFF08\u6295\u6BD2\u8005/\u7EA2\u5507\u5973\u90CE\uFF09\uFF1B\u4FE1\u606F\u5DF2\u516C\u5F00\u6216\u81EA\u8EAB\u4EF7\u503C\u4E0D\u9AD8\u65F6\u53EF\u8003\u8651\u63A5\u53D7\u5904\u51B3\u3002",
    "\u53A8\u5E08": "\u6570\u5B570/1/2\u7528\u4E8E\u5EA7\u4F4D\u62D3\u6251\u63A8\u7406\uFF1B\u6CE8\u610F\u964C\u5BA2/\u95F4\u8C0D\u5E26\u6765\u7684\u504F\u5DEE\uFF1B\u4FE1\u606F\u5DF2\u516C\u5F00\u6216\u81EA\u8EAB\u4EF7\u503C\u4E0D\u9AD8\u65F6\u53EF\u8003\u8651\u63A5\u53D7\u5904\u51B3\u3002",
    "\u5171\u60C5\u8005": "\u53EF\u9010\u6B65\u5904\u51B3\u90BB\u5EA7\u6269\u5C55\u63A2\u6D4B\u8303\u56F4\uFF0C\u4E14\u6613\u6210\u4E3A\u6295\u6BD2\u76EE\u6807\u3002",
    "\u5360\u535C\u5E08": "\u6CE8\u610F\u5E72\u6270\u9879\uFF0C\u7ED3\u5408\u4EA4\u53C9\u67E5\u9A8C\u4E0E\u6392\u9664\u6CD5\u9501\u5B9A\u6076\u9B54\u3002",
    "\u9001\u846C\u8005": "\u7528\u4E8E\u9A8C\u8BC1\u522B\u4EBA\u8DF3\u7684\u8EAB\u4EFD\u4E0E\u9152\u9B3C\uFF0C\u5C3D\u91CF\u4FDD\u6301\u5B58\u6D3B\u3002",
    "\u8D1E\u6D01\u8005": "\u627E\u767D\u677F\u9547\u6C11\u63D0\u540D\u81EA\u8BC1\uFF0C\u4F46\u4EE3\u4EF7\u9AD8\u9700\u62E9\u673A\u3002",
    "\u730E\u624B": "\u4FDD\u7559\u5A01\u6151\u529B\uFF1B\u7A7A\u67AA\u4E5F\u80FD\u6392\u9664\u76EE\u6807\uFF08\u82E5\u6E05\u9192\uFF09\u3002",
    "\u50E7\u4FA3": "\u4F18\u5148\u4FDD\u62A4\u5F3A\u4FE1\u606F\u4F4D\uFF1B\u5E73\u5B89\u591C\u4E0D\u4E00\u5B9A\u7B49\u4E8E\u5B88\u5BF9\u3002",
    "\u58EB\u5175": "\u53EF\u8BF1\u5BFC\u6076\u9B54\u7A7A\u5200\uFF1B\u4E5F\u5E38\u88AB\u6076\u9B54\u5047\u8DF3\u3002",
    "\u5B88\u9E26\u4EBA": "\u9700\u8981\u665A\u4E0A\u6B7B\u4EA1\u624D\u80FD\u89E6\u53D1\uFF0C\u53EF\u4F2A\u88C5\u9AD8\u5A01\u80C1\u5584\u826F\u8EAB\u4EFD\u9A97\u5200\u3002",
    "\u9547\u957F": "\u53EF\u63A8\u8FDB\u5230\u4E09\u4EBA\u4E14\u65E0\u5904\u51B3\u83B7\u80DC\uFF1B\u66FF\u6B7B\u53EF\u80FD\u66B4\u9732\u8EAB\u4EFD\u3002",
    "\u5723\u5F92": "\u5C3D\u65E9\u58F0\u660E\u907F\u514D\u88AB\u8BEF\u5904\u51B3\uFF0C\u53EF\u7528\u9001\u846C\u8005/\u730E\u624B\u9A8C\u8BC1\u5047\u5723\u5F92\u3002",
    "\u964C\u5BA2": "\u6C61\u67D3\u4FE1\u606F\uFF0C\u53EF\u8003\u8651\u5C3D\u65E9\u88AB\u5904\u51B3\u4EE5\u51CF\u5C11\u5BF9\u4FE1\u606F\u7684\u5E72\u6270\u3002",
    "\u9152\u9B3C": "\u4FE1\u606F\u51B2\u7A81\u65F6\u8003\u8651\u81EA\u5DF1\u662F\u9152\u9B3C\uFF0C\u7ED3\u5408\u5916\u6765\u8005\u6570\u91CF\u5224\u65AD\u3002",
    "\u7BA1\u5BB6": "\u9009\u62E9\u53EF\u4FE1\u4E3B\u4EBA\u4FDD\u6301\u7968\u6743\uFF0C\u53EF\u89C6\u5C40\u52BF\u800C\u5B9A\u3002",
    "\u6295\u6BD2\u8005": "\u91CD\u70B9\u6BD2\u5F3A\u4FE1\u606F\u4F4D\uFF1B\u53EF\u6BD2\u8D1E\u6D01\u8005/\u730E\u624B/\u9001\u846C\u8005\u6765\u5E72\u6270\u3002",
    "\u95F4\u8C0D": "\u5229\u7528\u9B54\u5178\u534F\u52A9\u6076\u9B54\u8DF3\u8EAB\u4EFD\uFF0C\u5FC5\u8981\u65F6\u501F\u8D1E\u6D01\u8005\u81EA\u8BC1\u3002",
    "\u7EA2\u5507\u5973\u90CE": "\u4FDD\u6301\u4F4E\u8C03\uFF0C\u6076\u9B54\u6B7B\u540E\u63A5\u5200\u4E3A\u5C0F\u6076\u9B54\uFF1B\u5B58\u6D3B\u4EBA\u6570>=5\u65F6\u6076\u9B54\u53EF\u66F4\u5927\u80C6\u3002",
    "\u7537\u7235": "\u6270\u4E71\u5916\u6765\u8005\u6570\u91CF\uFF0C\u53EF\u81EA\u7206\u5438\u5F15\u706B\u529B\u6216\u4F2A\u88C5\u5916\u6765\u8005\u3002",
    "\u5C0F\u6076\u9B54": "\u4F18\u5148\u51FB\u6740\u5F3A\u4FE1\u606F\u4F4D\u3002\u5FC5\u8981\u65F6\u53EF\u4EE5\u81EA\u6740\u4F20\u5200\u7ED9\u722A\u7259\u3002"
  };
  var TEAM_LABEL = { townsfolk: "\u9547\u6C11", outsider: "\u5916\u6765\u8005", minion: "\u722A\u7259", demon: "\u6076\u9B54" };
  var FULL_ROLE_RULES = SCRIPT.roles.map((role) => `${role.name}\uFF08${TEAM_LABEL[role.team] || role.team}\uFF09\uFF1A${role.ability}`).join("\uFF1B");
  var SLAYER_DECLARATION_TEMPLATE = "\u6211\u662F\u730E\u624B\uFF0C\u6211\u8981\u5411\u73A9\u5BB6X\u5F00\u67AA";
  var SLAYER_DECLARATION_NOTICE = `\u730E\u624B\u58F0\u660E\u89C4\u5219\uFF1A\u4EFB\u4F55\u4EBA\u90FD\u53EF\u4EE5\u58F0\u79F0\u81EA\u5DF1\u662F\u730E\u624B\uFF0C\u4F46\u5FC5\u987B\u4E25\u683C\u4F7F\u7528\u683C\u5F0F"${SLAYER_DECLARATION_TEMPLATE}"\uFF0C\u8FD9\u91CC\u7684X\u662F\u4E00\u4E2A\u6570\u5B57\u3002\u53EA\u6709\u771F\u6B63\u7684\u6E05\u9192\u4E14\u5065\u5EB7\u7684\u730E\u624B\u547D\u4E2D\u6076\u9B54\u624D\u6709\u6548\u679C\uFF0C\u4E14\u6BCF\u540D\u73A9\u5BB6\u6BCF\u5C40\u4EC5\u9996\u6B21\u8BE5\u683C\u5F0F\u4F1A\u88AB\u7ED3\u7B97\u3002`;
  var MAX_NOMINATIONS_PER_DAY = Infinity;
  var DEFAULT_DAY_DISCUSSION_MINUTES = 8;
  var MODEL_OPTIONS = [];
  function setMODEL_OPTIONS(v) {
    MODEL_OPTIONS = v;
  }
  var DEFAULT_MODEL = "";
  var EVIL_ROLE_NAMES = SCRIPT.roles.filter((role) => role.team === "minion" || role.team === "demon").map((role) => role.name);
  var INFO_FORMAT_HINTS = {
    "\u53A8\u5E08\u4FE1\u606F": "\u683C\u5F0F\u4E3A 'N \u5BF9\u76F8\u90BB\u90AA\u6076\u73A9\u5BB6'\uFF0CN \u4E3A 0-3 \u7684\u6574\u6570\u3002\u4F8B\u5982\uFF1A'2 \u5BF9\u76F8\u90BB\u90AA\u6076\u73A9\u5BB6'\u3002",
    "\u6D17\u8863\u5987\u4FE1\u606F": "\u683C\u5F0F\u4E3A 'A \u6216 B \u662F [\u9547\u6C11\u89D2\u8272\u540D]'\uFF0CA\u548CB\u5FC5\u987B\u662F\u5728\u573A\u73A9\u5BB6\u540D\uFF0C\u89D2\u8272\u5FC5\u987B\u662F\u5267\u672C\u4E2D\u7684\u9547\u6C11\u89D2\u8272\u3002\u4F8B\u5982\uFF1A'\u5F20\u4E09 \u6216 \u674E\u56DB \u662F \u53A8\u5E08'\u3002",
    "\u56FE\u4E66\u7BA1\u7406\u5458\u4FE1\u606F": "\u683C\u5F0F\u4E3A 'A \u6216 B \u662F [\u5916\u6765\u8005\u89D2\u8272\u540D]' \u6216 '\u6CA1\u6709\u5916\u6765\u8005\u5728\u573A'\u3002A\u548CB\u5FC5\u987B\u662F\u5728\u573A\u73A9\u5BB6\u540D\uFF0C\u89D2\u8272\u5FC5\u987B\u662F\u5267\u672C\u4E2D\u7684\u5916\u6765\u8005\u89D2\u8272\u3002",
    "\u8C03\u67E5\u5458\u4FE1\u606F": "\u683C\u5F0F\u4E3A 'A \u6216 B \u662F [\u722A\u7259\u89D2\u8272\u540D]' \u6216 '\u6CA1\u6709\u722A\u7259\u5728\u573A'\u3002A\u548CB\u5FC5\u987B\u662F\u5728\u573A\u73A9\u5BB6\u540D\uFF0C\u89D2\u8272\u5FC5\u987B\u662F\u5267\u672C\u4E2D\u7684\u722A\u7259\u89D2\u8272\u3002",
    "\u5171\u60C5\u8005\u4FE1\u606F": "\u683C\u5F0F\u4E3A\u7EAF\u6570\u5B57 '0'\u3001'1' \u6216 '2'\uFF0C\u8868\u793A\u4E0E\u8BE5\u73A9\u5BB6\u76F8\u90BB\u7684\u4E24\u540D\u5B58\u6D3B\u73A9\u5BB6\u4E2D\u90AA\u6076\u73A9\u5BB6\u7684\u4EBA\u6570\u3002",
    "\u5360\u535C\u5E08\u4FE1\u606F": "\u683C\u5F0F\u4E3A '\u6709\u6076\u9B54' \u6216 '\u6CA1\u6709\u6076\u9B54'\u3002",
    "\u9001\u846C\u8005\u4FE1\u606F": "\u683C\u5F0F\u4E3A\u4E00\u4E2A\u89D2\u8272\u540D\uFF0C\u5FC5\u987B\u662F\u5267\u672C\u4E2D\u5B58\u5728\u7684\u89D2\u8272\u3002\u4F8B\u5982\uFF1A'\u6295\u6BD2\u8005'\u3002",
    "\u5B88\u9E26\u4EBA\u4FE1\u606F": "\u683C\u5F0F\u4E3A\u4E00\u4E2A\u89D2\u8272\u540D\uFF0C\u5FC5\u987B\u662F\u5267\u672C\u4E2D\u5B58\u5728\u7684\u89D2\u8272\u3002\u4F8B\u5982\uFF1A'\u5C0F\u6076\u9B54'\u3002"
  };
  var NEWBIE_GUIDE = [
    `\u4F60\u6B63\u5728\u6E38\u73A9\u300A\u8840\u67D3\u949F\u697C\xB7\u6697\u6D41\u6D8C\u52A8\u300B\uFF0C\u8FD9\u662F\u4E00\u6B3E\u8FDB\u9636\u7248\u793E\u4EA4\u63A8\u7406\u6E38\u620F\uFF0C\u53EF\u7406\u89E3\u4E3A"\u6BCF\u4E2A\u4EBA\u90FD\u6709\u72EC\u7279\u8D85\u80FD\u529B\u7684\u72FC\u4EBA\u6740"\u3002`,
    `\u6838\u5FC3\u673A\u5236\u662F"\u6B7B\u800C\u4E0D\u50F5"\u548C"\u4FE1\u606F\u8FF7\u96FE"\uFF1A\u6B7B\u4EBA\u4ECD\u53EF\u53C2\u4E0E\u8BA8\u8BBA\u4E14\u62E5\u6709\u4E00\u7968\u6B7B\u4EBA\u7968\uFF1B\u9189\u9152\u4E0E\u4E2D\u6BD2\u4F1A\u8BA9\u6280\u80FD\u4E00\u5B9A\u5931\u6548\uFF0C\u4FE1\u606F\u5219\u53EF\u80FD\u9519\u8BEF\uFF0C\u9700\u8981\u903B\u8F91\u9A8C\u8BC1\u3002`,
    "\u6E38\u620F\u5206\u4E3A\u5584\u826F\u4E0E\u90AA\u6076\u9635\u8425\u3002\u9547\u6C11\u548C\u5916\u6765\u8005\u5C5E\u4E8E\u5584\u826F\u9635\u8425\uFF0C\u722A\u7259\u548C\u6076\u9B54\u5C5E\u4E8E\u90AA\u6076\u9635\u8425\u3002\u5584\u826F\u9635\u8425\u7684\u83B7\u80DC\u6761\u4EF6\u662F\u5904\u51B3\u6076\u9B54\uFF0C\u6216\u89E6\u53D1\u5584\u826F\u9635\u8425\u7279\u6B8A\u7684\u80DC\u5229\u673A\u5236\uFF08\u5982\u9547\u957F\u65E5\uFF09\uFF1B\u90AA\u6076\u9635\u8425\u7684\u83B7\u80DC\u6761\u4EF6\u662F\u8BA9\u573A\u4E0A\u4EC5\u5269\u4E24\u540D\u5B58\u6D3B\u73A9\u5BB6\u4E14\u6076\u9B54\u5B58\u6D3B\uFF0C\u6216\u89E6\u53D1\u5584\u826F\u9635\u8425\u7279\u6B8A\u7684\u5931\u8D25\u673A\u5236\uFF08\u6BD4\u5982\u5723\u5F92\u88AB\u5904\u51B3\uFF09\u3002",
    "\u591C\u665A\uFF1A\u6709\u591C\u884C\u6280\u80FD\u7684\u4EBA\u88AB\u5524\u9192\u83B7\u5F97\u7EBF\u7D22/\u6267\u884C\u884C\u52A8\uFF0C\u5176\u4F59\u73A9\u5BB6\u95ED\u773C\u7761\u89C9\u3002",
    "\u767D\u5929\uFF1A\u8BF4\u4E66\u4EBA\u516C\u5E03\u6628\u591C\u6B7B\u4EA1\u7684\u73A9\u5BB6\uFF08\u4E0D\u516C\u5E03\u8EAB\u4EFD\uFF09\uFF0C\u6240\u6709\u4EBA\u81EA\u7531\u53D1\u8A00\u4EA4\u6362\u4FE1\u606F\u3002\u7B2C\u4E00\u4E2A\u767D\u5929\u53EF\u4EE5\u79C1\u804A\u548C\u516C\u804A\uFF0C\u540E\u7EED\u7684\u767D\u5929\u53EA\u80FD\u516C\u804A\u3002",
    "\u7B2C\u4E00\u4E2A\u767D\u5929\u7684\u79C1\u804A\u73AF\u8282\u5F88\u91CD\u8981\uFF0C\u5584\u826F\u9635\u8425\u53EF\u4EE5\u4EA4\u6362\u7EBF\u7D22\u3001\u5EFA\u7ACB\u4FE1\u4EFB\u5173\u7CFB\u548C\u5236\u5B9A\u7B56\u7565\uFF1B\u90AA\u6076\u9635\u8425\u961F\u53CB\u4E4B\u95F4\u53EF\u4EE5\u79C1\u804A\u4EA4\u6D41\u4FE1\u606F\uFF0C\u5236\u5B9A\u6218\u672F\uFF0C\u534F\u8C03\u5F7C\u6B64\u7A7F\u4EC0\u4E48\u4F2A\u88C5\u8EAB\u4EFD\u3002\u56E0\u6B64\u5EFA\u8BAE\u5145\u5206\u5229\u7528\u79C1\u804A\u3002\u4F60\u548C\u522B\u7684\u73A9\u5BB6\u7684\u79C1\u804A\u5185\u5BB9\u53EA\u6709\u4F60\u4EEC\u81EA\u5DF1\u77E5\u9053\uFF0C\u522B\u4EBA\u4E0D\u77E5\u9053\uFF0C\u662F\u5B89\u5168\u7684\u3002",
    "\u9EC4\u660F\uFF1A\u63D0\u540D -> \u88AB\u63D0\u540D\u8005\u8FA9\u89E3 -> \u5168\u5458\u6295\u7968\uFF1B\u5F97\u7968\u6700\u9AD8\u4E14\u5927\u4E8E\u7B49\u4E8E\u5B58\u6D3B\u73A9\u5BB6\u4EBA\u6570\u7684\u4E00\u534A\u8005\u88AB\u5904\u51B3\u3002",
    "\u6B7B\u4EA1\u73A9\u5BB6\u4ECD\u53EF\u53D1\u8A00\uFF1B\u6B7B\u4EBA\u5728\u4E4B\u540E\u7684\u6E38\u620F\u4E2D\u6709\u4E14\u4EC5\u6709\u4E00\u7968\u6B7B\u4EBA\u7968\u3002",
    "\u9189\u9152/\u4E2D\u6BD2\u5219\u6280\u80FD\u4E00\u5B9A\u5931\u6548, \u4FE1\u606F\u53EF\u80FD\u9519\u8BEF\u3002"
  ].join(" ");
  var GOOD_MODULE = [
    "\u5584\u826F\u73A9\u6CD5\uFF1A\u4F18\u5148\u62FC\u7EBF\u7D22\u3001\u4EA4\u53C9\u9A8C\u8BC1\u4E0E\u5EFA\u7ACB\u53EF\u4FE1\u76DF\u53CB\u3002",
    "\u5F3A\u4FE1\u606F\u4F4D\u548C\u5F3A\u529F\u80FD\u4F4D\uFF08\u5982\u5360\u535C/\u5171\u60C5/\u730E\u624B\uFF09\u53EF\u4EE5\u8C28\u614E\u62A5\u8EAB\u4EFD\uFF0C\u4E00\u6B21\u6027\u4FE1\u606F\u4F4D(\u5C24\u5176\u662F\u53EA\u6709\u9996\u591C\u6709\u4FE1\u606F\u7684\u89D2\u8272\uFF09\u53EF\u89C6\u5C40\u52BF\u65E9\u62A5\u3002",
    "\u4FE1\u606F\u51B2\u7A81\u65F6\u522B\u5FD8\u4E86\u8003\u8651\u9189\u9152/\u4E2D\u6BD2\u6216\u6709\u574F\u4EBA\u8BF4\u8C0E\u7684\u53EF\u80FD\uFF0C\u4E0D\u8981\u6025\u4E8E\u4E0B\u5B9A\u8BBA\u3002"
  ].join(" ");
  var EVIL_MODULE = [
    "\u90AA\u6076\u73A9\u6CD5\uFF1A\u9996\u591C\u4E92\u8BA4\uFF08\u77E5\u9053\u961F\u53CB\u662F\u8C01\u4F46\u4E0D\u77E5\u9053\u722A\u7259\u5177\u4F53\u662F\u4EC0\u4E48\u89D2\u8272\uFF09\uFF0C\u6076\u9B54\u83B7\u5F97\u4E09\u4E2A\u4E0D\u5728\u573A\u8EAB\u4EFD\uFF08\u9547\u6C11\u6216\u5916\u6765\u8005\uFF09\uFF0C\u8FD9\u662F\u7ED9\u90AA\u6076\u9635\u8425\u7A7F\u4F2A\u88C5\u8EAB\u4EFD\u7528\u7684\uFF0C\u5EFA\u8BAE\u6076\u9B54\u5728\u79C1\u804A\u65F6\u544A\u8BC9\u722A\u7259\u5E76\u548C\u722A\u7259\u5546\u91CF\u5F7C\u6B64\u7A7F\u4EC0\u4E48\u8EAB\u4EFD",
    "\u53EA\u6709\u6076\u9B54\u4F1A\u77E5\u9053\u8FD9\u4E09\u4E2A\u8EAB\u4EFD\u4E0D\u5728\u573A\uFF0C\u597D\u4EBA\u4E0D\u4F1A\u77E5\u9053\uFF0C\u56E0\u6B64\u6076\u9B54\u548C\u722A\u7259\u53EF\u4EE5\u653E\u5FC3\u5730\u4F2A\u88C5\u6210\u8FD9\u4E09\u4E2A\u8EAB\u4EFD",
    "\u5728\u7B2C\u4E00\u4E2A\u767D\u5929\u7684\u516C\u804A\u548C\u79C1\u804A\u5F00\u59CB\u524D\uFF0C\u90AA\u6076\u9635\u8425\u6240\u6709\u6210\u5458\u4F1A\u5148\u8FDB\u884C\u4E00\u6B21\u5BC6\u804A\uFF08\u4EC5\u90AA\u6076\u6210\u5458\u53EF\u89C1\uFF09\uFF0C\u8BF7\u5145\u5206\u5229\u7528\u8FD9\u6B21\u5BC6\u804A\u673A\u4F1A\u4EA4\u6D41\u4FE1\u606F\u3001\u5236\u5B9A\u6218\u672F\u3001\u534F\u8C03\u5F7C\u6B64\u7A7F\u4EC0\u4E48\u4F2A\u88C5\u8EAB\u4EFD\u3002",
    "\u4F2A\u88C5\u6210\u53EF\u4FE1\u9547\u6C11\u6216\u5916\u6765\u8005\uFF0C\u7F16\u9020\u4E0E\u89D2\u8272\u80FD\u529B\u76F8\u7B26\u7684\u4FE1\u606F\u3002",
    "\u5C0F\u6076\u9B54\u5728\u665A\u4E0A\u53EF\u81EA\u6740\u4F20\u4F4D\uFF0C\u5C24\u5176\u662F\u5728\u88AB\u5927\u5BB6\u6000\u7591\u5E76\u4E0A\u7126\u70B9\u4F4D\u65F6\u53EF\u4EE5\u8FD9\u4E48\u505A\uFF0C\u5236\u9020\u6DF7\u4E71\u4E0E\u4FE1\u606F\u65AD\u5C42\u3002"
  ].join(" ");
  var GOOD_GUIDELINES = [
    "\u4FDD\u5BC6\u4E0E\u793C\u4EEA\uFF1A\u4E0D\u63D0\u6A21\u578B/\u63D0\u793A\u8BCD\uFF0C\u4E0D\u8FB1\u9A82\u9A9A\u6270\u3002",
    "\u884C\u52A8\u89C4\u5219\uFF1A\u6B7B\u4EBA\u4E0D\u80FD\u63D0\u540D\uFF0C\u4F46\u662F\u53EF\u4EE5\u88AB\u63D0\u540D\uFF1B\u6B7B\u4EA1\u7968\u53EA\u80FD\u7528\u4E00\u6B21\uFF0C\u8BF7\u4ED4\u7EC6\u659F\u914C\u7528\u5728\u4EC0\u4E48\u65F6\u5019\u3002",
    "\u89C4\u5219\u8981\u70B9\uFF1A\u9996\u591C\u6076\u9B54\u4E0D\u6740\u4EBA\uFF1B\u9189\u9152/\u4E2D\u6BD2/\u964C\u5BA2/\u95F4\u8C0D\u53EF\u80FD\u626D\u66F2\u4FE1\u606F\uFF1B\u7537\u7235\u4F1A+2\u5916\u6765\u8005\u3002",
    "\u7B56\u7565\uFF1A\u4E0D\u5FC5\u5168\u76D8\u6258\u51FA\uFF1B\u5F3A\u4FE1\u606F\u6216\u5F3A\u529F\u80FD\u4F4D\u89D2\u8272\u53EF\u4EE5\u66F4\u8C28\u614E\uFF0C\u9996\u591C\u4FE1\u606F\u89D2\u8272\u53EF\u89C6\u60C5\u51B5\u65E9\u62A5\uFF1B\u8FD9\u4E2A\u677F\u5B50\u7684\u5916\u6765\u8005\u62A5\u8EAB\u4EFD\u90FD\u6BD4\u8F83\u5B89\u5168\uFF0C\u4E5F\u53EF\u4EE5\u89C6\u5C40\u52BF\u800C\u5B9A\u3002",
    "\u7968\u578B\u5206\u6790\uFF1A\u5173\u6CE8\u6295\u7968\u6A21\u5F0F\uFF0C\u7968\u578B\u5F02\u5E38\u53EF\u4EE5\u4F5C\u4E3A\u63A8\u7406\u7EBF\u7D22\u3002",
    GOOD_MODULE
  ].join(" ");
  var EVIL_GUIDELINES = [
    "\u4FDD\u5BC6\u4E0E\u793C\u4EEA\uFF1A\u4E0D\u63D0\u6A21\u578B/\u63D0\u793A\u8BCD\uFF0C\u4E0D\u8FB1\u9A82\u9A9A\u6270\u3002",
    "\u884C\u52A8\u89C4\u5219\uFF1A\u6B7B\u4EBA\u4E0D\u80FD\u63D0\u540D\uFF0C\u4F46\u53EF\u4EE5\u88AB\u63D0\u540D\uFF1B\u6B7B\u4EBA\u7968\u53EA\u80FD\u7528\u4E00\u6B21\uFF0C\u8BF7\u4ED4\u7EC6\u659F\u914C\u7528\u5728\u4EC0\u4E48\u65F6\u5019\u3002",
    "\u90AA\u6076\u9635\u8425\u9700\u5171\u540C\u7F16\u7EC7\u4E00\u5957\u4E0D\u4E92\u65A5\u7684\u865A\u5047\u8EAB\u4EFD\u7F51\uFF0C\u4EE5\u5B8C\u7F8E\u878D\u5165\u597D\u4EBA\u9635\u8425\u7684\u62A5\u4FE1\u606F\u73AF\u8282\uFF0C\u907F\u514D\u786C\u649E\u8EAB\u4EFD\u3002",
    "\u76EE\u6807\uFF1A\u4FDD\u62A4\u6076\u9B54\uFF0C\u5236\u9020\u4FE1\u606F\u51B2\u7A81\u4E0E\u6DF7\u4E71\uFF0C\u8BEF\u5BFC\u5584\u826F\u73A9\u5BB6\u7684\u63A8\u7406\uFF1B\u722A\u7259\u4F18\u5148\u4FDD\u62A4\u6076\u9B54\uFF0C\u5FC5\u8981\u65F6\u53EF\u4EE5\u727A\u7272\u722A\u7259\u6765\u4FDD\u62A4\u6076\u9B54\u6216\u5236\u9020\u6DF7\u4E71\u3002",
    "**\u5343\u4E07\u4E0D\u8981\u5411\u597D\u4EBA\u81EA\u66DD\u4E3A\u90AA\u6076\u9635\u8425\u3001\u722A\u7259\u6216\u6076\u9B54\uFF0C\u4E5F\u4E0D\u8981\u4EE5\u4EFB\u4F55\u5F62\u5F0F\u5411\u597D\u4EBA\u66B4\u9732\u90AA\u6076\u9635\u8425\u7684\u989D\u5916\u89C6\u91CE\uFF08\u6BD4\u5982\u95F4\u8C0D\u770B\u5230\u4E86\u9B54\u5178\uFF0C\u81EA\u5DF1\u7684\u6295\u6BD2\u8005\u961F\u53CB\u6295\u6BD2\u4E86\u67D0\u67D0\uFF09\uFF0C\u4E0D\u7BA1\u4F60\u6709\u6CA1\u6709\u6B7B\u4EA1**\uFF0C\u9664\u975E\u4F60\u8BA4\u4E3A\u81EA\u66DD\u5728\u67D0\u4E9B\u60C5\u51B5\u4E0B\u662F\u5BF9\u90AA\u6076\u9635\u8425\u6709\u5229\u7684\u6E38\u620F\u7B56\u7565\u3002",
    "\u7968\u578B\u610F\u8BC6\uFF1A\u5584\u826F\u73A9\u5BB6\u53EF\u80FD\u4F1A\u901A\u8FC7\u5206\u6790\u6295\u7968\u6A21\u5F0F\u6765\u5BFB\u627E\u7EBF\u7D22\uFF0C\u6CE8\u610F\u4F60\u7684\u6295\u7968\u884C\u4E3A\u662F\u5426\u81EA\u7136\u3002",
    EVIL_MODULE
  ].join(" ");
  var PLAYER_SYSTEM_PROMPT = [
    NEWBIE_GUIDE,
    "\u767D\u5929\u6D41\u7A0B\uFF1A\u8BA8\u8BBA -> \u63D0\u540D -> \u6295\u7968 -> \u53EF\u80FD\u5904\u51B3\uFF1B\u591C\u665A\u6D41\u7A0B\uFF1A\u6309\u5267\u672C\u987A\u5E8F\u7ED3\u7B97\u89D2\u8272\u80FD\u529B\u3002\u53EA\u6709\u7B2C\u4E00\u4E2A\u767D\u5929\u80FD\u79C1\u804A\uFF0C\u540E\u7EED\u7684\u767D\u5929\u53EA\u6709\u516C\u804A\u3002",
    "\u9996\u591C\u6076\u9B54\u4E0D\u6740\u4EBA\uFF1B\u4E4B\u540E\u6BCF\u665A\u6076\u9B54\u9009\u62E9\u4E00\u540D\u73A9\u5BB6\u6B7B\u4EA1\uFF08\u9664\u975E\u88AB\u4FDD\u62A4/\u514D\u75AB/\u89C4\u5219\u5F71\u54CD\uFF09\u3002",
    "\u63D0\u540D\u89C4\u5219\uFF1A\u53EA\u6709\u6D3B\u4EBA\u80FD\u63D0\u540D\uFF0C\u6B7B\u4EBA\u548C\u6D3B\u4EBA\u5747\u53EF\u88AB\u63D0\u540D\uFF1B\u88AB\u63D0\u540D\u540E\u8FDB\u5165\u6295\u7968\u9636\u6BB5\uFF0C\u6295\u7968\u9636\u6BB5\u4E0D\u518D\u804A\u5929\u3002",
    `\u6697\u6D41\u6D8C\u52A8\u7684\u89D2\u8272\u5728\u4E00\u5C40\u4E2D\u4E0D\u4F1A\u91CD\u590D\uFF1A\u6BCF\u4E2A\u89D2\u8272\u6700\u591A\u51FA\u73B0\u4E00\u6B21\uFF1B\u9189\u9152/\u4E2D\u6BD2\u4E0D\u4F1A\u9020\u6210"\u91CD\u590D\u89D2\u8272"\u3002`,
    "\u9189\u9152/\u4E2D\u6BD2\u72B6\u6001\u4E0D\u4F1A\u88AB\u76F4\u63A5\u544A\u77E5\uFF0C\u9700\u8981\u57FA\u4E8E\u4FE1\u606F\u77DB\u76FE\u63D0\u51FA\u63A8\u6D4B\u3002",
    SLAYER_DECLARATION_NOTICE,
    `\u6697\u6D41\u6D8C\u52A8\u5B8C\u6574\u89D2\u8272\u4E0E\u6280\u80FD\u8868\uFF1A${FULL_ROLE_RULES}`,
    "\u4FE1\u606F\u8FB9\u754C\uFF1A\u53EA\u80FD\u4F7F\u7528\u516C\u5F00\u4FE1\u606F\u4E0E\u4E2A\u4EBA\u79C1\u5BC6\u4FE1\u606F\uFF1B\u4E0D\u8981\u58F0\u79F0\u770B\u5230\u9B54\u5178\u3002",
    `\u53EF\u80FD\u5B58\u5728\u9189\u9152/\u4E2D\u6BD2/\u964C\u5BA2/\u95F4\u8C0D\u5BFC\u81F4\u4FE1\u606F\u504F\u5DEE\uFF1B\u4FE1\u606F\u53EF\u4EE5\u8868\u8FBE\u4E3A"\u53EF\u80FD/\u63A8\u6D4B"\u3002`,
    "\u90AA\u6076\u9635\u8425\u53EF\u80FD\u4F1A\u6B3A\u9A97\u4E0E\u8BEF\u5BFC\u3002",
    "\u53EA\u80FD\u7528\u4E2D\u6587\u53D1\u8A00, \u4E0D\u8981\u63D0\u53CAAI/\u63D0\u793A\u8BCD/\u7CFB\u7EDF\u7B49\u51FA\u620F\u5185\u5BB9\u3002"
  ].join("");
  var PLAYER_BRIEF_SYSTEM_PROMPT = [
    "\u4F60\u662F\u300A\u8840\u67D3\u949F\u697C\xB7\u6697\u6D41\u6D8C\u52A8\u300B\u7684\u73A9\u5BB6\uFF0C\u53EA\u80FD\u7528\u4E2D\u6587\u7B80\u77ED\u56DE\u5E94\u3002",
    `\u89C4\u5219\u8981\u70B9\uFF1A\u6BCF\u4E2A\u89D2\u8272\u4E00\u5C40\u53EA\u51FA\u73B0\u4E00\u6B21\uFF1B\u9189\u9152/\u4E2D\u6BD2\u4E0D\u4F1A\u5BFC\u81F4"\u91CD\u590D\u89D2\u8272"\u3002`,
    "\u9189\u9152/\u4E2D\u6BD2\u4E0D\u4F1A\u88AB\u76F4\u63A5\u544A\u77E5\uFF0C\u9700\u8981\u57FA\u4E8E\u4FE1\u606F\u77DB\u76FE\u63D0\u51FA\u63A8\u6D4B\u3002",
    NEWBIE_GUIDE,
    SLAYER_DECLARATION_NOTICE,
    `\u6697\u6D41\u6D8C\u52A8\u5B8C\u6574\u89D2\u8272\u4E0E\u6280\u80FD\u8868\uFF1A${FULL_ROLE_RULES}`,
    "\u9075\u5B88\u89C4\u5219\u4E0E\u4FE1\u606F\u8FB9\u754C\uFF1A\u4E0D\u5192\u5145\u522B\u4EBA\u3001\u4E0D\u7F16\u9020\u4E0D\u5B58\u5728\u7684\u516C\u5F00\u4FE1\u606F\u3001\u4E0D\u58F0\u79F0\u8D85\u51FA\u80FD\u529B\u7684\u7ED3\u679C\u3001\u4E0D\u63D0\u7CFB\u7EDF\u3002"
  ].join("");
  var PLAYER_JSON_SYSTEM_PROMPT = [
    "\u4F60\u662F\u300A\u8840\u67D3\u949F\u697C\xB7\u6697\u6D41\u6D8C\u52A8\u300B\u7684\u73A9\u5BB6\u3002",
    `\u89C4\u5219\u8981\u70B9\uFF1A\u6BCF\u4E2A\u89D2\u8272\u4E00\u5C40\u53EA\u51FA\u73B0\u4E00\u6B21\uFF1B\u9189\u9152/\u4E2D\u6BD2\u4E0D\u4F1A\u5BFC\u81F4"\u91CD\u590D\u89D2\u8272"\u3002`,
    "\u9189\u9152/\u4E2D\u6BD2\u4E0D\u4F1A\u88AB\u76F4\u63A5\u544A\u77E5, \u9700\u8981\u57FA\u4E8E\u4FE1\u606F\u77DB\u76FE\u63D0\u51FA\u63A8\u6D4B\u3002",
    NEWBIE_GUIDE,
    SLAYER_DECLARATION_NOTICE,
    `\u6697\u6D41\u6D8C\u52A8\u5B8C\u6574\u89D2\u8272\u4E0E\u6280\u80FD\u8868\uFF1A${FULL_ROLE_RULES}`,
    "\u4E25\u683C\u9075\u5B88\u89C4\u5219\u4E0E\u4FE1\u606F\u8FB9\u754C, \u53EA\u8F93\u51FAJSON, \u4E0D\u8981\u8F93\u51FA\u5176\u5B83\u5185\u5BB9\u3002",
    "\u4E0D\u8981\u8F93\u51FA\u5FC3\u7406\u6D3B\u52A8\u3001\u5185\u5FC3\u72EC\u767D\u6216\u601D\u8003\u8FC7\u7A0B\u3002"
  ].join("");
  var USE_FULL_CHAT_HISTORY = true;
  var USE_INCREMENTAL_CHAT_CONTEXT = true;
  var CHAT_DELTA_MAX_LINES = 0;
  var CHAT_DELTA_RECENT_LINES = 10;
  var USE_PERSISTENT_MESSAGES = true;
  var STORYTELLER_LLM_ENABLED = true;
  var STORYTELLER_REGISTER_LLM_ENABLED = true;
  var HUMAN_CHAT_GRACE_MS = 650;
  var STORAGE_KEY = "botc_singleplayer_state_v1";
  var MODEL_STORAGE = "botc_deepseek_model";
  var AUTO_NIGHT_STORAGE = "botc_singleplayer_auto_night";
  var TRAJECTORY_STORAGE = "botc_record_trajectory";
  var DAY_DISCUSSION_STORAGE = "botc_day_discussion_minutes";
  var CHAT_NEAR_BOTTOM_THRESHOLD = 96;
  var MODEL_PRICING = {
    "deepseek-chat-v3-0324": [0.2, 0.77],
    "deepseek-chat": [0.2, 0.77],
    "deepseek-reasoner": [0.55, 2.19],
    "deepseek-v3.2": [0.26, 0.38],
    "deepseek-v3": [0.26, 0.38],
    "gemini-3-pro": [2, 12],
    "gemini-3.1-pro": [2, 12],
    "gemini-3.1-flash-lite": [0.1, 0.4],
    "gemini-3-flash": [0.1, 0.4],
    "claude-3-haiku": [0.25, 1.25],
    "claude-3-5-haiku": [0.8, 4],
    "claude-haiku-4.5": [0.8, 4],
    "claude-haiku-4-5": [0.8, 4],
    "claude-3-7-sonnet": [3, 15],
    "claude-sonnet-4.5": [3, 15],
    "claude-sonnet-4": [3, 15],
    "claude-sonnet-4-5": [3, 15],
    "claude-opus-4": [15, 75],
    "claude-opus-4-1": [15, 75],
    "claude-opus-4-5": [15, 75],
    "claude-opus-4-6": [5, 25],
    "gpt-5.1": [2, 8],
    "gpt-5": [2.5, 15],
    "gpt-5.4": [2.5, 15],
    "gpt-4.1": [2, 8],
    "mimo-v2-pro": [1, 3],
    "minimax-m2.7": [0.3, 1.2],
    "minimax-m1": [0.5, 2],
    "grok-4.20-beta": [2, 6],
    "grok-4.1-fast": [0.2, 0.5],
    "grok-4.1": [3, 15],
    "grok-3-mini": [0.3, 0.5],
    "qwen3.5-397b": [0.39, 2.34],
    "qwen3-235b": [0.7, 0.7],
    "step-3.5-flash": [0.1, 0.3],
    "step-3.5": [0.1, 0.3],
    "step-2": [0.5, 2],
    "nemotron-3-super": [0.1, 0.5],
    "nemotron-ultra": [0.5, 2],
    "glm-5": [0.72, 2.3],
    "glm-4-plus": [0.5, 2],
    "kimi-k2.5": [0.42, 2.2],
    "kimi-k2": [0.5, 2],
    "seed-2.0-lite": [0.25, 2]
  };

  // js/state.js
  var state = null;
  var autoNightTimer = null;
  var inactivityTimer = null;
  var countdownTimer = null;
  var voteTimer = null;
  var dayDiscussionTimer = null;
  var loadedModelCatalog = null;
  var customProviderMap = {};
  var catalogApiKeys = {};
  var modelCatalogLoadStatus = { ok: false, message: "\u5C1A\u672A\u52A0\u8F7D model_catalog.yaml" };
  var modelCatalogHealth = [];
  var modelHealthWarned = false;
  var chatPinLockTimer = null;
  var chatLayoutObserver = null;
  var chatRelockRaf = null;
  var chatRelockTimer = null;
  var speechRecognition = null;
  var speechActive = false;
  var speechSupported = false;
  var speechInterim = "";
  function setSpeechRecognition(v) {
    speechRecognition = v;
  }
  function setSpeechActive(v) {
    speechActive = v;
  }
  function setSpeechSupported(v) {
    speechSupported = v;
  }
  function setSpeechInterim(v) {
    speechInterim = v;
  }
  function setLoadedModelCatalog(v) {
    loadedModelCatalog = v;
  }
  function setCustomProviderMap(v) {
    customProviderMap = v;
  }
  function setCatalogApiKeys(v) {
    catalogApiKeys = v;
  }
  function setModelCatalogLoadStatus(v) {
    modelCatalogLoadStatus = v;
  }
  function setModelCatalogHealth(v) {
    modelCatalogHealth = v;
  }
  function setModelHealthWarned(v) {
    modelHealthWarned = v;
  }
  function setAutoNightTimer(v) {
    autoNightTimer = v;
  }
  function setDayDiscussionTimer(v) {
    dayDiscussionTimer = v;
  }
  function setState(v) {
    state = v;
  }
  function setChatPinLockTimer(v) {
    chatPinLockTimer = v;
  }
  function setChatLayoutObserver(v) {
    chatLayoutObserver = v;
  }
  function setChatRelockRaf(v) {
    chatRelockRaf = v;
  }
  function setChatRelockTimer(v) {
    chatRelockTimer = v;
  }
  function emptyPlayer(index) {
    return {
      id: `p${index + 1}`,
      name: `\u73A9\u5BB6${index + 1}`,
      roleId: "",
      roleName: "",
      apparentRoleId: "",
      apparentRoleName: "",
      team: "",
      alive: true,
      isHuman: false,
      drunk: false,
      poisoned: false,
      poisonedUntilDay: 0,
      protected: false,
      virginUsed: false,
      slayerUsed: false,
      slayerClaimed: false,
      demonCooldownNight: 0,
      butlerMasterId: "",
      deadVoteUsed: false,
      modelChoice: "default",
      lastPrivateDay: 0,
      publicChatCursorBySession: {},
      privateInfoCursorBySession: {},
      messageSessions: {},
      roleHistory: [],
      memory: [],
      privateInfo: []
    };
  }
  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (error) {
      return null;
    }
  }
  var _syncUnreadChatCount = () => {
  };
  function setNormalizeDeps({ syncUnreadChatCount: syncUnreadChatCount2 }) {
    if (typeof syncUnreadChatCount2 === "function") {
      _syncUnreadChatCount = syncUnreadChatCount2;
    }
  }
  function normalizeState() {
    if (!state) return;
    if (typeof state.paused !== "boolean") state.paused = false;
    if (typeof state.pausedAt !== "number") state.pausedAt = 0;
    if (typeof state.postGameChat !== "boolean") state.postGameChat = false;
    if (typeof state.postGameInProgress !== "boolean") state.postGameInProgress = false;
    if (typeof state.firstNightRecognitionDone !== "boolean") state.firstNightRecognitionDone = false;
    if (typeof state.lastHumanChatAt !== "number" || !Number.isFinite(state.lastHumanChatAt)) {
      state.lastHumanChatAt = 0;
    }
    if (typeof state.lastDiscussionAt !== "number") state.lastDiscussionAt = 0;
    if (typeof state.nominationCountdown !== "number") state.nominationCountdown = 0;
    if (typeof state.discussionMaxRemaining !== "number" || !Number.isFinite(state.discussionMaxRemaining) || state.discussionMaxRemaining <= 0) {
      const duration = state.discussionDurationSeconds || DEFAULT_DAY_DISCUSSION_MINUTES * 60;
      state.discussionMaxRemaining = duration;
    }
    if (typeof state.discussionDurationSeconds !== "number") {
      state.discussionDurationSeconds = DEFAULT_DAY_DISCUSSION_MINUTES * 60;
    }
    if (typeof state.currentNomineeId !== "string") state.currentNomineeId = "";
    if (typeof state.currentNominatorId !== "string") state.currentNominatorId = "";
    if (typeof state.nominationPhase !== "string") state.nominationPhase = "";
    if (typeof state.nominationStep !== "string") state.nominationStep = "";
    if (!Array.isArray(state.nominationOrder)) state.nominationOrder = [];
    if (typeof state.nominationCursor !== "number") state.nominationCursor = 0;
    if (!Array.isArray(state.nominationVoteOrder)) state.nominationVoteOrder = [];
    if (typeof state.nominationVoteCursor !== "number") state.nominationVoteCursor = 0;
    if (typeof state.currentVoterId !== "string") state.currentVoterId = "";
    if (!state.nominationVotes || typeof state.nominationVotes !== "object") state.nominationVotes = {};
    if (!Array.isArray(state.nominationUsedIds)) state.nominationUsedIds = [];
    if (!Array.isArray(state.nomineeUsedIds)) state.nomineeUsedIds = [];
    if (typeof state.scarletTriggered !== "boolean") state.scarletTriggered = false;
    if (typeof state.discussionToken !== "number") state.discussionToken = 0;
    if (typeof state.voteCountdown !== "number") state.voteCountdown = 0;
    if (typeof state.pendingAiVotes !== "number") state.pendingAiVotes = 0;
    if (typeof state.humanVoted !== "boolean") state.humanVoted = false;
    if (typeof state.votingToken !== "number") state.votingToken = 0;
    if (typeof state.dayNominationCount !== "number") state.dayNominationCount = 0;
    if (typeof state.dayHighestVotes !== "number") state.dayHighestVotes = 0;
    if (typeof state.dayHighestNomineeId !== "string") state.dayHighestNomineeId = "";
    if (typeof state.dayHighestTied !== "boolean") state.dayHighestTied = false;
    if (!Array.isArray(state.pendingNominationQueue)) state.pendingNominationQueue = [];
    if (typeof state.pendingAiNominations !== "number") state.pendingAiNominations = 0;
    if (typeof state.humanNominationDone !== "boolean") state.humanNominationDone = false;
    if (typeof state.nominationInProgress !== "boolean") state.nominationInProgress = false;
    if (!Array.isArray(state.publicLog)) state.publicLog = [];
    if (!state.claims || typeof state.claims !== "object") state.claims = {};
    if (!Array.isArray(state.claimHistory)) state.claimHistory = [];
    if (typeof state.recordTrajectories !== "boolean") state.recordTrajectories = false;
    if (!Array.isArray(state.trajectoryLog)) state.trajectoryLog = [];
    if (!Array.isArray(state.privateChat)) state.privateChat = [];
    if (!Array.isArray(state.evilChat)) state.evilChat = [];
    if (state.winner === void 0) state.winner = null;
    if (state.winCondition === void 0) state.winCondition = null;
    if (!Array.isArray(state.replayEvents)) state.replayEvents = [];
    if (!Array.isArray(state.infoAudit)) state.infoAudit = [];
    if (!state.lastInfoRegistrationMap || typeof state.lastInfoRegistrationMap !== "object") {
      state.lastInfoRegistrationMap = {};
    }
    if (typeof state.humanActionConfirmed !== "boolean") state.humanActionConfirmed = false;
    if (typeof state.storySummary !== "string") state.storySummary = "";
    if (typeof state.storySummaryPending !== "boolean") state.storySummaryPending = false;
    if (typeof state.chatFilter !== "string") state.chatFilter = "all";
    if (typeof state.chatSearch !== "string") state.chatSearch = "";
    if (typeof state.chatAutoFollow !== "boolean") state.chatAutoFollow = true;
    if (typeof state.chatUnreadCount !== "number" || !Number.isFinite(state.chatUnreadCount) || state.chatUnreadCount < 0) {
      state.chatUnreadCount = 0;
    }
    if (typeof state.chatLastReadSeq !== "number" || !Number.isFinite(state.chatLastReadSeq) || state.chatLastReadSeq < 0) {
      state.chatLastReadSeq = 0;
    }
    if (typeof state.discussionTownDrawerOpen !== "boolean") state.discussionTownDrawerOpen = false;
    if (typeof state.discussionLogDrawerOpen !== "boolean") state.discussionLogDrawerOpen = false;
    if (typeof state.lastDawnNarration !== "string") state.lastDawnNarration = "";
    if (!Array.isArray(state.chat)) state.chat = [];
    let maxChatSeq = 0;
    state.chat = state.chat.map((entry, index) => {
      const current = entry && typeof entry === "object" ? entry : {};
      let seq = Number(current.seq);
      if (!Number.isFinite(seq) || seq <= 0) {
        seq = index + 1;
      }
      if (seq > maxChatSeq) maxChatSeq = seq;
      return {
        ...current,
        seq
      };
    });
    if (typeof state.chatSeq !== "number" || !Number.isFinite(state.chatSeq) || state.chatSeq < maxChatSeq) {
      state.chatSeq = maxChatSeq;
    }
    if (state.chatLastReadSeq === 0 && state.chatSeq > 0) {
      state.chatLastReadSeq = state.chatSeq;
    } else if (state.chatLastReadSeq > state.chatSeq) {
      state.chatLastReadSeq = state.chatSeq;
    }
    _syncUnreadChatCount();
    if (state.players) {
      state.players.forEach((player) => {
        if (typeof player.deadVoteUsed !== "boolean") player.deadVoteUsed = false;
        if (typeof player.modelChoice !== "string") player.modelChoice = "default";
        if (typeof player.lastPrivateDay !== "number") player.lastPrivateDay = 0;
        if (!player.publicChatCursorBySession || typeof player.publicChatCursorBySession !== "object") {
          player.publicChatCursorBySession = {};
        }
        if (!player.privateInfoCursorBySession || typeof player.privateInfoCursorBySession !== "object") {
          player.privateInfoCursorBySession = {};
        }
        if (typeof player.demonCooldownNight !== "number") player.demonCooldownNight = 0;
        if (!player.messageSessions || typeof player.messageSessions !== "object") player.messageSessions = {};
        if (typeof player.slayerClaimed !== "boolean") player.slayerClaimed = false;
        if (typeof player.noteRole !== "string") player.noteRole = "";
        if (!Array.isArray(player.noteTags)) player.noteTags = [];
        if (player.roleId && !player.apparentRoleId) {
          player.apparentRoleId = player.roleId;
          player.apparentRoleName = player.roleName || "";
        }
        if (!Array.isArray(player.roleHistory)) {
          player.roleHistory = player.roleName ? [{
            roleName: player.roleName,
            phase: "\u521D\u59CB",
            night: 0,
            day: 0,
            reason: "\u521D\u59CB\u5206\u914D"
          }] : [];
        }
      });
    }
  }
  function setInactivityTimer(val) {
    inactivityTimer = val;
  }
  function setCountdownTimer(val) {
    countdownTimer = val;
  }
  function setVoteTimer(val) {
    voteTimer = val;
  }

  // js/utils.js
  function shuffle(list) {
    const array = list.slice();
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms || 0)));
  }
  function extractJson(text) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      return null;
    }
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch (error) {
      return null;
    }
  }
  function getRoleById(roleId) {
    return SCRIPT.roles.find((role) => role.id === roleId);
  }
  function getApparentRole(player) {
    if (player.apparentRoleId) {
      return getRoleById(player.apparentRoleId);
    }
    return getRoleById(player.roleId);
  }
  function getPromptName(player) {
    if (!player) return "\u672A\u77E5";
    const base = (player.name || "").trim() || "\u73A9\u5BB6";
    return base === "\u4F60" ? "\u73A9\u5BB6" : base;
  }
  function playerOptionLabel(p) {
    return p.name + (p.alive ? "" : "\uFF08\u5DF2\u6B7B\u4EA1\uFF09");
  }
  function playerOptionHtml(p) {
    return `<option value="${p.id}">${playerOptionLabel(p)}</option>`;
  }
  function stripHtmlForPrompt(text) {
    return String(text || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  function getPromptSpeakerName(speaker) {
    if (!state) return speaker;
    const player = state.players.find((p) => p.name === speaker);
    if (player) return getPromptName(player);
    return speaker;
  }
  function formatPromptChatLine(entry) {
    const speaker = getPromptSpeakerName(entry?.speaker || "\u7CFB\u7EDF");
    const content = stripHtmlForPrompt(entry?.text || "") || "\uFF08\u7A7A\uFF09";
    return `${speaker}: ${content}`;
  }
  function normalizeTargetName(name) {
    if (!name) return "";
    return String(name).replace(/\(真人\)/g, "").replace(/（已死亡）/g, "").trim();
  }

  // js/prompts.js
  var _dayDiscussionMinutesInput = null;
  function getDayDiscussionMinutesInput() {
    if (!_dayDiscussionMinutesInput) {
      _dayDiscussionMinutesInput = document.getElementById("dayDiscussionMinutes");
    }
    return _dayDiscussionMinutesInput;
  }
  var _startDayDiscussionTimer = () => {
  };
  var _renderStatus = () => {
  };
  function setPromptDeps({ startDayDiscussionTimer: startDayDiscussionTimer2, renderStatus: renderStatus2 }) {
    if (typeof startDayDiscussionTimer2 === "function") {
      _startDayDiscussionTimer = startDayDiscussionTimer2;
    }
    if (typeof renderStatus2 === "function") {
      _renderStatus = renderStatus2;
    }
  }
  function getInfoRolePlayer(roleName) {
    return state.players.find(
      (p) => p.alive && (p.roleName === roleName || p.drunk && p.apparentRoleName === roleName)
    );
  }
  function getPhaseLabel() {
    if (!state) return "\u672A\u5F00\u5C40";
    if (state.ended) return state.postGameChat ? "\u8D5B\u540E\u804A\u5929" : "\u5DF2\u7ED3\u675F";
    if (!state.started) return "\u672A\u5F00\u5C40";
    if (state.phase === "night") return `\u591C\u665A${state.nightCount}`;
    return `\u767D\u5929${state.dayCount}`;
  }
  async function waitHumanChatGrace() {
    if (!state) return;
    const elapsed = Date.now() - (Number(state.lastHumanChatAt) || 0);
    const remain = HUMAN_CHAT_GRACE_MS - elapsed;
    if (remain > 0) {
      await sleep(remain);
    }
  }
  function getAliveDeadSummary() {
    const alive = state.players.filter((p) => p.alive).map((p) => getPromptName(p)).join("\u3001");
    const dead = state.players.filter((p) => !p.alive).map((p) => getPromptName(p)).join("\u3001");
    return `\u76EE\u524D\u7684\u5B58\u6D3B\u73A9\u5BB6\uFF1A${alive || "\u65E0"}
\u76EE\u524D\u7684\u6B7B\u4EA1\u73A9\u5BB6\uFF1A${dead || "\u65E0"}`;
  }
  function getDiscussionDurationSeconds() {
    if (state && typeof state.discussionDurationSeconds === "number" && state.discussionDurationSeconds > 0) {
      return state.discussionDurationSeconds;
    }
    const dayDiscussionMinutesInput2 = getDayDiscussionMinutesInput();
    const inputVal = dayDiscussionMinutesInput2 ? Number(dayDiscussionMinutesInput2.value) : NaN;
    if (Number.isFinite(inputVal) && inputVal > 0) {
      return Math.round(inputVal * 60);
    }
    const stored = Number(localStorage.getItem(DAY_DISCUSSION_STORAGE));
    if (Number.isFinite(stored) && stored > 0) {
      return Math.round(stored * 60);
    }
    return DEFAULT_DAY_DISCUSSION_MINUTES * 60;
  }
  function applyDiscussionMinutes(minutes, applyCurrent = true) {
    const safeMinutes = Math.max(1, Math.min(30, Math.round(minutes)));
    const seconds = safeMinutes * 60;
    localStorage.setItem(DAY_DISCUSSION_STORAGE, String(safeMinutes));
    const dayDiscussionMinutesInput2 = getDayDiscussionMinutesInput();
    if (dayDiscussionMinutesInput2) {
      dayDiscussionMinutesInput2.value = safeMinutes;
    }
    if (state) {
      const prevDuration = state.discussionDurationSeconds || seconds;
      state.discussionDurationSeconds = seconds;
      if (state.started && state.phase === "day" && state.dayStage === "discussion" && applyCurrent) {
        const ratio = prevDuration > 0 ? state.discussionMaxRemaining / prevDuration : 1;
        state.discussionMaxRemaining = Math.max(1, Math.round(seconds * Math.min(1, ratio)));
        _startDayDiscussionTimer(false);
      } else if (!state.started) {
        state.discussionMaxRemaining = seconds;
      }
    }
    _renderStatus();
    saveState();
  }
  function summarizeChatEntriesForPrompt(entries) {
    if (!entries.length) return "\u65E0";
    const speakerCounts = /* @__PURE__ */ new Map();
    entries.forEach((entry) => {
      const speaker = getPromptSpeakerName(entry?.speaker || "\u7CFB\u7EDF");
      speakerCounts.set(speaker, (speakerCounts.get(speaker) || 0) + 1);
    });
    const topSpeakers = Array.from(speakerCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name, count]) => `${name}(${count})`).join("\u3001");
    return `\u8F83\u65E9\u65B0\u589E\u516C\u5171\u53D1\u8A00 ${entries.length} \u6761\uFF0C\u4E3B\u8981\u53D1\u8A00\u8005\uFF1A${topSpeakers || "\u65E0"}`;
  }
  function getSessionCursorKey(sessionKey) {
    const raw = String(sessionKey || "default").trim();
    return raw || "default";
  }
  function formatPrivateInfoForPrompt(actor, sessionKey = "default", limit = 4) {
    if (!actor || !Array.isArray(actor.privateInfo) || !actor.privateInfo.length) return "\u65E0";
    const safeLimit = Math.max(1, Math.round(limit));
    if (!USE_INCREMENTAL_CHAT_CONTEXT) {
      return actor.privateInfo.join(" / ") || "\u65E0";
    }
    if (!actor.privateInfoCursorBySession || typeof actor.privateInfoCursorBySession !== "object") {
      actor.privateInfoCursorBySession = {};
    }
    const key = getSessionCursorKey(sessionKey);
    const cursorRaw = actor.privateInfoCursorBySession[key];
    const cursor = Number.isFinite(cursorRaw) ? cursorRaw : 0;
    const unseen = actor.privateInfo.slice(Math.max(0, cursor));
    if (!unseen.length) {
      return "\u65E0\u65B0\u589E\u79C1\u5BC6\u4FE1\u606F\uFF08\u6CBF\u7528\u4F1A\u8BDD\u4E2D\u5DF2\u77E5\u79C1\u5BC6\u4FE1\u606F\uFF09";
    }
    return unseen.slice(-safeLimit).join(" / ");
  }
  function markActorPromptCursors(actor, sessionKey = "default") {
    if (!actor || !state || !USE_INCREMENTAL_CHAT_CONTEXT) return;
    const key = getSessionCursorKey(sessionKey);
    if (!actor.publicChatCursorBySession || typeof actor.publicChatCursorBySession !== "object") {
      actor.publicChatCursorBySession = {};
    }
    actor.publicChatCursorBySession[key] = Number(state.chatSeq) || 0;
    if (!actor.privateInfoCursorBySession || typeof actor.privateInfoCursorBySession !== "object") {
      actor.privateInfoCursorBySession = {};
    }
    const infoCount = Array.isArray(actor.privateInfo) ? actor.privateInfo.length : 0;
    actor.privateInfoCursorBySession[key] = infoCount;
  }
  function buildPlayerStaticSystemContext(actor, options = {}) {
    if (!actor || !state) return "";
    const apparentRole = getApparentRole(actor);
    const roleName = apparentRole ? apparentRole.name : "\u672A\u77E5";
    const roleAbility = apparentRole ? apparentRole.ability : "\u65E0";
    const roleHint = apparentRole ? ROLE_HINTS[apparentRole.name] || "\u65E0" : "\u65E0";
    const guidelines = getTeamGuidelines(actor);
    const strategyTips = getStrategyTips(actor);
    const roster = buildPromptRoster();
    const includeStrategy = options.includeStrategy === true;
    const includeGuidelines = options.includeGuidelines !== false;
    const prefix = options.prefix || "\u73A9\u5BB6\u9759\u6001\u6863\u6848\uFF08\u4F1A\u8BDD\u5185\u957F\u671F\u6709\u6548\uFF09";
    const teamLabel = { townsfolk: "\u9547\u6C11", outsider: "\u5916\u6765\u8005", minion: "\u722A\u7259", demon: "\u6076\u9B54" };
    const campLabel = actor.team === "minion" || actor.team === "demon" ? "\u90AA\u6076\u9635\u8425" : "\u5584\u826F\u9635\u8425";
    const count = state.players.length;
    const dist = PLAYER_DISTRIBUTION[count];
    const distLine = dist ? `\u672C\u5C40\u914D\u7F6E\uFF1A${count}\u4EBA\u5C40\uFF08${dist.townsfolk}\u9547\u6C11 + ${dist.outsider}\u5916\u6765\u8005 + ${dist.minion}\u722A\u7259 + ${dist.demon}\u6076\u9B54\uFF09` : `\u672C\u5C40\u914D\u7F6E\uFF1A${count}\u4EBA\u5C40`;
    const lines = [
      prefix,
      `\u4F60\u662F\uFF1A${actor.name}`,
      `\u73A9\u5BB6\u5EA7\u6B21\uFF1A${roster}`,
      distLine,
      "\u6CE8\u610F\uFF1A\u82E5\u6709\u7537\u7235\u5728\u573A\uFF0C\u4F1A+2\u5916\u6765\u8005\u3001-2\u9547\u6C11\u3002",
      `\u4F60\u7684\u8EAB\u4EFD\uFF1A${roleName}`,
      `\u4F60\u7684\u89D2\u8272\u7C7B\u578B\uFF1A${teamLabel[apparentRole?.team || actor.team] || "\u672A\u77E5"}`,
      `\u4F60\u7684\u9635\u8425\uFF1A${campLabel}`,
      `\u4F60\u7684\u89D2\u8272\u80FD\u529B\uFF1A${roleAbility}`,
      `\u89C4\u5219\u63D0\u793A\uFF1A${roleHint}`
    ];
    if (includeStrategy) {
      lines.push(`\u7B56\u7565\u5EFA\u8BAE\uFF1A${strategyTips}`);
    }
    if (includeGuidelines) {
      lines.push(`\u9635\u8425\u51C6\u5219\uFF1A${guidelines}`);
    }
    return lines.join("\n");
  }
  function buildPlayerPromptMessages(actor, sessionKey, userContent, options = {}) {
    const systemPrompt = options.systemPrompt || PLAYER_SYSTEM_PROMPT;
    const staticContext = buildPlayerStaticSystemContext(actor, options);
    const messages = [{ role: "system", content: systemPrompt }];
    if (staticContext) {
      messages.push({ role: "system", content: staticContext });
    }
    messages.push({ role: "user", content: userContent });
    return messages;
  }
  function formatChatForPrompt(limit = 12, actor = null, sessionKey = "default") {
    const effectiveLimit = USE_FULL_CHAT_HISTORY ? null : limit;
    const fullSlice = effectiveLimit ? state.chat.slice(-effectiveLimit) : state.chat.slice();
    if (!USE_INCREMENTAL_CHAT_CONTEXT || !actor) {
      if (!fullSlice.length) return "\u65E0";
      return fullSlice.map((entry) => formatPromptChatLine(entry)).join("\n");
    }
    if (!actor.publicChatCursorBySession || typeof actor.publicChatCursorBySession !== "object") {
      actor.publicChatCursorBySession = {};
    }
    const key = getSessionCursorKey(sessionKey);
    const cursorRaw = actor.publicChatCursorBySession[key];
    const cursor = Number.isFinite(cursorRaw) ? cursorRaw : 0;
    const unseen = state.chat.filter((entry) => (Number(entry.seq) || 0) > cursor);
    if (!unseen.length) {
      return "\u65E0\u65B0\u589E\u516C\u5171\u53D1\u8A00\uFF08\u4F60\u5DF2\u770B\u8FC7\u5F53\u524D\u5168\u90E8\u516C\u5F00\u53D1\u8A00\uFF09";
    }
    if (CHAT_DELTA_MAX_LINES <= 0 || unseen.length <= CHAT_DELTA_MAX_LINES) {
      return unseen.map((entry) => formatPromptChatLine(entry)).join("\n");
    }
    const recentCount = Math.max(1, CHAT_DELTA_RECENT_LINES);
    const older = unseen.slice(0, Math.max(0, unseen.length - recentCount));
    const recent = unseen.slice(-recentCount);
    const olderSummary = summarizeChatEntriesForPrompt(older);
    return `${olderSummary}
\u6700\u8FD1\u65B0\u589E\uFF1A
${recent.map((entry) => formatPromptChatLine(entry)).join("\n")}`;
  }
  function buildPromptRoster() {
    if (!state) return "";
    const n = state.players.length;
    const list = state.players.map((p, idx) => `${idx + 1}\u53F7=${getPromptName(p)}`).join("\uFF0C");
    return `${list}\uFF08\u5EA7\u4F4D\u56F4\u6210\u4E00\u5708\uFF0C\u6BD4\u59821\u53F7\u7684\u5DE6\u53F3\u4E24\u8FB9\u662F${n}\u53F7\u548C2\u53F7\uFF09`;
  }
  function getTeamGuidelines(player) {
    if (!player) return "";
    if (player.team === "minion" || player.team === "demon") {
      return EVIL_GUIDELINES;
    }
    return GOOD_GUIDELINES;
  }
  function getStrategyTips(player) {
    const roleName = player?.roleName || "";
    const strongInfo = ["\u5171\u60C5\u8005", "\u5360\u535C\u5E08", "\u9001\u846C\u8005"];
    const firstNightInfo = ["\u6D17\u8863\u5987", "\u56FE\u4E66\u7BA1\u7406\u5458", "\u8C03\u67E5\u5458", "\u53A8\u5E08"];
    const tips = [];
    if (player?.team === "minion" || player?.team === "demon") {
      tips.push("\u4F18\u5148\u4F2A\u88C5\u6210\u53EF\u4FE1\u7684\u5584\u826F\u89D2\u8272\uFF0C\u907F\u514D\u4E0E\u4ED6\u4EBA\u5F3A\u52BF\u649E\u8EAB\u4EFD\u3002");
      tips.push("\u53EF\u4EE5\u8C28\u614E\u4F7F\u7528\u4E0D\u5728\u573A\u8EAB\u4EFD\u7684\u601D\u8DEF\u6765\u8DF3\u8EAB\u4EFD\u3002");
      tips.push("\u5FC5\u8981\u65F6\u53EF\u4EE5\u5F15\u5BFC\u81EA\u5DF1\u88AB\u5904\u51B3\u6765\u5750\u9AD8\u8EAB\u4EFD\uFF0C\u4F46\u8981\u770B\u5C40\u52BF\u3002");
    } else {
      tips.push("\u597D\u4EBA\u4E0D\u5FC5\u5168\u76D8\u6258\u51FA\uFF0C\u6CE8\u610F\u907F\u514D\u88AB\u6076\u9B54\u591C\u5200\u3002");
      if (strongInfo.includes(roleName)) {
        tips.push("\u4F60\u662F\u5F3A\u4FE1\u606F\u89D2\u8272\uFF0C\u522B\u5728\u7B2C\u4E00\u5929\u8FC7\u65E9\u81EA\u66DD\u3002");
      } else if (firstNightInfo.includes(roleName)) {
        tips.push("\u4F60\u662F\u9996\u591C\u4FE1\u606F\u89D2\u8272\uFF0C\u53EF\u4EE5\u8F83\u65E9\u62A5\u8EAB\u4EFD\u4E0E\u4FE1\u606F\uFF0C\u4F46\u53EF\u4FDD\u7559\u4E0D\u786E\u5B9A\u6027\u3002");
      }
      if (player?.team === "outsider") {
        tips.push("\u5916\u6765\u8005\u662F\u5426\u81EA\u66DD\u53D6\u51B3\u4E8E\u5C40\u52BF\u4E0E\u4FE1\u606F\u4EF7\u503C\uFF0C\u6743\u8861\u80FD\u5426\u5E2E\u5230\u56E2\u961F\u518D\u51B3\u5B9A\u3002");
      }
    }
    if (player && !player.alive) {
      tips.push("\u4F60\u5DF2\u6B7B\u4EA1\uFF1A\u4ECD\u53EF\u53D1\u8A00\uFF0C\u4F46\u4E0D\u80FD\u63D0\u540D\uFF1B\u4EC5\u6709\u4E00\u6B21\u9057\u8A00\u7968\u3002");
    }
    if (player?.privateInfo?.some((line) => line.includes("\u4E09\u4E2A\u4E0D\u5728\u573A\u8EAB\u4EFD"))) {
      tips.push("\u4F60\u77E5\u9053\u4E0D\u5728\u573A\u8EAB\u4EFD\uFF0C\u53EA\u6311\u4E00\u4E2A\u4F2A\u88C5\uFF0C\u4E0D\u8981\u516C\u5F00\u5B8C\u6574\u540D\u5355\u3002");
    }
    if (roleName && ROLE_STRATEGY_TIPS[roleName]) {
      tips.push(ROLE_STRATEGY_TIPS[roleName]);
    }
    return tips.join(" ");
  }
  var TEAM_LABEL_COMPRESS = { townsfolk: "\u9547\u6C11", outsider: "\u5916\u6765\u8005", minion: "\u722A\u7259", demon: "\u6076\u9B54" };
  async function compressPlayerSessions(player) {
    if (!player || !state) return;
    if (player.isHuman) return;
    const sessionKey = "chat";
    const session = player.messageSessions && player.messageSessions[sessionKey];
    if (!session) return;
    const systemMsgs = session.filter((msg) => msg.role === "system");
    const apparentRole = getApparentRole(player);
    const roleName = apparentRole ? apparentRole.name : "\u672A\u77E5";
    const isEvil = player.team === "minion" || player.team === "demon";
    const aliveDeadSummary = getAliveDeadSummary();
    const dayLabel = `\u767D\u5929${state.dayCount}`;
    const prevNightLabel = `\u591C\u665A${state.nightCount}`;
    const todayChat = state.chat.filter((entry) => entry.phase === dayLabel || entry.phase === prevNightLabel);
    const chatSection = todayChat.length ? todayChat.map((entry) => `[${entry.phase}] ${entry.speaker}: ${stripHtmlForPrompt(entry.text || "")}`).join("\n") : "\u65E0";
    const privateInfoSection = Array.isArray(player.privateInfo) && player.privateInfo.length ? player.privateInfo.join("\n") : "\u65E0";
    const myPrivateChats = (state.privateChat || []).filter((c) => c.senderId === player.id || c.targetId === player.id);
    const privateChatSection = myPrivateChats.length ? myPrivateChats.map((c) => {
      const label = c.senderId === player.id ? "\u4F60 -> " + c.target : c.sender + " -> \u4F60";
      return `[\u79C1\u804A] ${label}: ${c.text}`;
    }).join("\n") : "\u65E0";
    const evilChatSection = (state.evilChat || []).length && isEvil ? state.evilChat.map((c) => `[\u90AA\u6076\u5BC6\u804A] ${c.sender}: ${c.text}`).join("\n") : "\u65E0";
    const historyText = `\u3010\u516C\u5171\u804A\u5929\u8BB0\u5F55\u3011
${chatSection}

\u3010\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\u3011
${privateInfoSection}

\u3010\u79C1\u804A\u8BB0\u5F55\u3011
${privateChatSection}

\u3010\u90AA\u6076\u5BC6\u804A\u8BB0\u5F55\u3011
${evilChatSection}`;
    if (todayChat.length === 0 && myPrivateChats.length === 0) return;
    let summarySystemContent;
    if (isEvil) {
      const evilTeammates = state.players.filter((p) => p.id !== player.id && (p.team === "minion" || p.team === "demon")).map((p) => `${p.name}\uFF08${TEAM_LABEL_COMPRESS[p.team] || p.team}\uFF09`).join("\u3001");
      summarySystemContent = [
        "\u4F60\u662F\u300A\u8840\u67D3\u949F\u697C\u300B\u7684\u4E00\u540D\u73A9\u5BB6\uFF0C\u6B63\u5728\u8FDB\u884C\u4E00\u573A\u91CD\u8981\u7684\u5BF9\u5C40\u3002",
        `\u4F60\u662F${player.name}\uFF0C\u8EAB\u4EFD\u662F${roleName}\uFF0C\u5C5E\u4E8E\u90AA\u6076\u9635\u8425\u3002`,
        `${aliveDeadSummary}`,
        `\u4F60\u7684\u90AA\u6076\u961F\u53CB\uFF1A${evilTeammates || "\u65E0"}`,
        "\u73B0\u5728\u767D\u5929\u7ED3\u675F\u4E86\uFF0C\u4F60\u9700\u8981\u5199\u4E00\u4EFD\u603B\u7ED3\u5907\u5FD8\u5F55\u3002\u8FD9\u4EFD\u603B\u7ED3\u5FC5\u987B\u5B8C\u6574\u3001\u51C6\u786E\u3001\u5177\u4F53\u3002",
        "\u8FD9\u4EFD\u603B\u7ED3\u53EA\u6709\u4F60\u80FD\u591F\u770B\u5230\uFF0C\u4E0D\u4F1A\u7ED9\u522B\u7684\u73A9\u5BB6\u770B\u3002",
        "\u8981\u6C42\uFF1A",
        "- \u533A\u5206\u3010\u4E8B\u5B9E\u3011\uFF08\u786E\u5B9E\u53D1\u751F\u7684\u4E8B\uFF09\u548C\u3010\u63A8\u6D4B\u3011\uFF08\u4F60\u7684\u5206\u6790\u5224\u65AD\uFF09",
        "- \u8BB0\u5F55\u8981\u5177\u4F53\uFF0C\u4E0D\u8981\u7B3C\u7EDF\u6982\u62EC",
        "- \u7AD9\u5728\u90AA\u6076\u9635\u8425\u7684\u89C6\u89D2\u601D\u8003\u2014\u2014\u4F60\u7684\u76EE\u6807\u662F\u4FDD\u62A4\u6076\u9B54\u5B58\u6D3B\u3001\u8BEF\u5BFC\u597D\u4EBA",
        "\u53EF\u4EE5\u53C2\u8003\u4EE5\u4E0B\u7ED3\u6784\u603B\u7ED3\uFF0C\u53EF\u4EE5\u89C6\u5177\u4F53\u6E38\u620F\u8BB0\u5F55\u800C\u6709\u6240\u8C03\u6574\uFF0C\u4E5F\u5B8C\u5168\u53EF\u4EE5\u6DFB\u52A0\u4F60\u60F3\u8BB0\u5F55\u7684\u522B\u7684\u5185\u5BB9\uFF1A",
        "1.\u3010\u8EAB\u4EFD\u58F0\u660E\u767B\u8BB0\u3011",
        "\u9010\u4E00\u5217\u51FA\u6BCF\u4F4D\u73A9\u5BB6\u4ECA\u5929\u58F0\u79F0\u7684\u8EAB\u4EFD\u3001\u63D0\u4F9B\u7684\u5177\u4F53\u4FE1\u606F\u5185\u5BB9\u3002\u6807\u6CE8\u54EA\u4E9B\u662F\u771F\u7684\u597D\u4EBA\uFF0C\u54EA\u4E9B\u662F\u4F60\u7684\u961F\u53CB\u5728\u4F2A\u88C5\u3002",
        "2.\u3010\u6211\u65B9\u4F2A\u88C5\u72B6\u6001\u3011",
        "- \u6211\u58F0\u79F0\u7684\u8EAB\u4EFD\u662F\u4EC0\u4E48\uFF1F\u7F16\u9020\u4E86\u54EA\u4E9B\u5047\u4FE1\u606F\uFF1F",
        "- \u961F\u53CB\u58F0\u79F0\u7684\u8EAB\u4EFD\u662F\u4EC0\u4E48\uFF1F",
        "- \u6211\u65B9\u7684\u4F2A\u88C5\u662F\u5426\u524D\u540E\u4E00\u81F4\uFF1F\u6709\u6CA1\u6709\u4EBA\u8D28\u7591\u6216\u8FFD\u95EE\uFF1F\u6709\u6CA1\u6709\u9732\u51FA\u7834\u7EFD\uFF1F",
        "- \u540E\u7EED\u9700\u8981\u8865\u5145\u54EA\u4E9B\u7EC6\u8282\u6765\u5706\u8C0E\uFF1F",
        "3.\u3010\u6B7B\u4EA1\u4E0E\u5904\u51B3\u8BB0\u5F55\u3011",
        "- \u6628\u665A\u8C01\u6B7B\u4E86\uFF1F\uFF08\u5982\u679C\u4F60\u662F\u6076\u9B54\u6216\u77E5\u9053\u51FB\u6740\u76EE\u6807\uFF09",
        "- \u4ECA\u5929\u90FD\u6709\u54EA\u4E9B\u63D0\u540D\uFF1F\u8C01\u63D0\u540D\u7684\u8C01\uFF1F\u7968\u578B\u548C\u7968\u6570\u5982\u4F55\uFF1F",
        "- \u4ECA\u5929\u6709\u4EBA\u88AB\u5904\u51B3\u5417\uFF1F\u662F\u8C01\uFF1F",
        "- \u8FD9\u4E9B\u7ED3\u679C\u5BF9\u6211\u65B9\u6709\u5229\u8FD8\u662F\u4E0D\u5229\uFF1F",
        "4.\u3010\u5A01\u80C1\u8BC4\u4F30\u3011",
        "\u6309\u5A01\u80C1\u7A0B\u5EA6\u6392\u5E8F\uFF0C\u5217\u51FA\u5BF9\u90AA\u6076\u9635\u8425\u6700\u5371\u9669\u7684\u5B58\u6D3B\u597D\u4EBA\uFF1A",
        "- \u8C01\u7684\u80FD\u529B\u6700\u5F3A\uFF1F\uFF08\u4F8B\u5982\u5360\u535C\u5E08\u3001\u5171\u60C5\u8005\u3001\u9001\u846C\u8005\u7B49\u80FD\u6301\u7EED\u4EA7\u51FA\u4FE1\u606F\u7684\u89D2\u8272\uFF0C\u4EE5\u53CA\u8D1E\u6D01\u8005\u3001\u50E7\u4FA3\u7B49\u6280\u80FD\u5F3A\u7684\u89D2\u8272\u7B49\uFF09",
        "- \u8C01\u7684\u63A8\u7406\u6700\u51C6\u786E\u3001\u6700\u63A5\u8FD1\u771F\u76F8\uFF1F",
        "- \u8C01\u5728\u7FA4\u4F17\u4E2D\u4FE1\u4EFB\u5EA6\u6700\u9AD8\u3001\u5E26\u8282\u594F\u80FD\u529B\u6700\u5F3A\uFF1F",
        "5.\u3010\u597D\u4EBA\u5F53\u524D\u63A8\u7406\u65B9\u5411\u3011",
        "- \u597D\u4EBA\u76EE\u524D\u6000\u7591\u8C01\u662F\u6076\u9B54\uFF1F\u6000\u7591\u8C01\u662F\u722A\u7259\uFF1F",
        "- \u8FD9\u4E2A\u65B9\u5411\u5BF9\u6211\u65B9\u662F\u5426\u6709\u5229\uFF1F",
        "- \u6709\u6CA1\u6709\u597D\u4EBA\u5728\u5185\u6597\u6216\u4E92\u76F8\u6000\u7591\uFF1F\u53EF\u4EE5\u5229\u7528\u5417\uFF1F",
        "6.\u3010\u4E0B\u4E00\u6B65\u884C\u52A8\u8BA1\u5212\u3011",
        "- \u6211\u548C\u961F\u53CB\u4E0B\u4E00\u6B65\u600E\u4E48\u914D\u5408\uFF1F",
        "- \u8BE5\u63A8\u52A8\u5904\u51B3\u8C01\u6765\u8F6C\u79FB\u89C6\u7EBF\u6216\u6D88\u706D\u5A01\u80C1\uFF1F",
        "- \u5982\u679C\u4F60\u662F\u6076\u9B54\uFF0C\u8BF7\u601D\u8003\u4ECA\u665A\u6076\u9B54\u5E94\u8BE5\u6740\u8C01\uFF1F\uFF08\u4F18\u5148\u6D88\u706D\u54EA\u4E2A\u80FD\u529B\u5F3A/\u63A8\u7406\u51C6/\u53D7\u4FE1\u4EFB\u7684\u597D\u4EBA\uFF09",
        "- \u53D1\u8A00\u7B56\u7565\uFF1A\u4E0B\u4E00\u6B21\u8BA8\u8BBA\u8981\u600E\u4E48\u5E26\u8282\u594F\uFF1F",
        "\u53EA\u8F93\u51FA\u603B\u7ED3\u5185\u5BB9\uFF0C\u4E0D\u8981\u8F93\u51FA\u5176\u4ED6\u4EFB\u4F55\u5185\u5BB9\u3002"
      ].join("\n");
    } else {
      summarySystemContent = [
        "\u4F60\u662F\u300A\u8840\u67D3\u949F\u697C\u300B\u7684\u4E00\u540D\u73A9\u5BB6\uFF0C\u6B63\u5728\u8FDB\u884C\u4E00\u573A\u91CD\u8981\u7684\u5BF9\u5C40\u3002",
        `\u4F60\u662F${player.name}\uFF0C\u8EAB\u4EFD\u662F${roleName}\uFF0C\u5C5E\u4E8E\u5584\u826F\u9635\u8425\u3002`,
        `${aliveDeadSummary}`,
        "\u73B0\u5728\u767D\u5929\u7ED3\u675F\u4E86\uFF0C\u4F60\u9700\u8981\u5199\u4E00\u4EFD\u603B\u7ED3\u5907\u5FD8\u5F55\u3002\u8FD9\u4EFD\u603B\u7ED3\u5FC5\u987B\u5B8C\u6574\u3001\u51C6\u786E\u3001\u5177\u4F53\u3002",
        "\u8FD9\u4EFD\u603B\u7ED3\u53EA\u6709\u4F60\u80FD\u591F\u770B\u5230\uFF0C\u4E0D\u4F1A\u7ED9\u522B\u7684\u73A9\u5BB6\u770B\u3002",
        "\u8981\u6C42\uFF1A",
        "- \u533A\u5206\u3010\u4E8B\u5B9E\u3011\uFF08\u786E\u5B9E\u53D1\u751F\u7684\u4E8B\uFF09\u548C\u3010\u63A8\u6D4B\u3011\uFF08\u4F60\u7684\u5206\u6790\u5224\u65AD\uFF09\uFF0C\u4E0D\u8981\u628A\u63A8\u6D4B\u5F53\u4E8B\u5B9E\u8BB0\u5F55",
        "- \u8BB0\u5F55\u8981\u5177\u4F53\uFF0C\u4E0D\u8981\u7B3C\u7EDF\u6982\u62EC\uFF08\u4F8B\u5982\u4E0D\u8981\u5199\u2018\u6709\u4EBA\u58F0\u79F0\u662F\u6D17\u8863\u5987'\uFF0C\u8981\u5199'\u5F20\u4E09\u58F0\u79F0\u662F\u6D17\u8863\u5987\uFF0C\u8868\u793A\u770B\u5230\u674E\u56DB\u548C\u738B\u4E94\u4E2D\u6709\u4E00\u4E2A\u53A8\u5E08'\uFF09",
        "\u53EF\u4EE5\u53C2\u8003\u4EE5\u4E0B\u7ED3\u6784\u603B\u7ED3\uFF0C\u53EF\u4EE5\u89C6\u5177\u4F53\u6E38\u620F\u8BB0\u5F55\u800C\u6709\u6240\u8C03\u6574\uFF0C\u4E5F\u5B8C\u5168\u53EF\u4EE5\u6DFB\u52A0\u4F60\u60F3\u8BB0\u5F55\u7684\u522B\u7684\u5185\u5BB9\uFF1A",
        "1.\u3010\u8EAB\u4EFD\u58F0\u660E\u767B\u8BB0\u3011",
        "\u9010\u4E00\u5217\u51FA\u6BCF\u4F4D\u73A9\u5BB6\u4ECA\u5929\u58F0\u79F0\u7684\u8EAB\u4EFD\u3001\u63D0\u4F9B\u7684\u5177\u4F53\u4FE1\u606F\u5185\u5BB9\u3002\u672A\u53D1\u8A00\u6216\u672A\u8DF3\u8EAB\u4EFD\u7684\u4E5F\u6807\u6CE8\u2018\u672A\u8868\u6001\u2019\u3002",
        "2.\u3010\u6211\u7684\u79C1\u5BC6\u4FE1\u606F\u6C47\u603B\u3011",
        "\u4F60\u81EA\u5DF1\u83B7\u5F97\u7684\u6240\u6709\u6280\u80FD\u7ED3\u679C\u548C\u79C1\u5BC6\u4FE1\u606F\uFF0C\u6309\u65F6\u95F4\u987A\u5E8F\u6574\u7406\u3002",
        "3.\u3010\u6B7B\u4EA1\u4E0E\u5904\u51B3\u8BB0\u5F55\u3011",
        "- \u6628\u665A\u8C01\u6B7B\u4E86\uFF1F\uFF08\u591C\u6740\uFF09",
        "- \u4ECA\u5929\u90FD\u6709\u54EA\u4E9B\u63D0\u540D\uFF1F\u8C01\u63D0\u540D\u7684\u8C01\uFF1F\u7968\u578B\u548C\u7968\u6570\u5982\u4F55\uFF1F",
        "- \u4ECA\u5929\u6709\u4EBA\u88AB\u5904\u51B3\u5417\uFF1F\u662F\u8C01\uFF1F",
        "4.\u3010\u77DB\u76FE\u4E0E\u7591\u70B9\u5206\u6790\u3011",
        "- \u54EA\u4E9B\u73A9\u5BB6\u7684\u4FE1\u606F\u4E92\u76F8\u77DB\u76FE\uFF1F\u5177\u4F53\u77DB\u76FE\u70B9\u662F\u4EC0\u4E48\uFF1F",
        "- \u8C01\u7684\u58F0\u660E\u4E0E\u5DF2\u77E5\u4E8B\u5B9E\u4E0D\u7B26\uFF1F",
        "- \u6709\u6CA1\u6709\u8EAB\u4EFD\u88AB\u91CD\u590D\u58F0\u79F0\uFF08\u649E\u8F66\uFF09\u7684\u60C5\u51B5\uFF1F",
        "5.\u3010\u5ACC\u7591\u8BC4\u4F30\u3011",
        "\u6839\u636E\u5F53\u524D\u6240\u6709\u4FE1\u606F\uFF0C\u5217\u51FA\u4F60\u5BF9\u6BCF\u4E2A\u5B58\u6D3B\u73A9\u5BB6\u7684\u4FE1\u4EFB\u5EA6\u5224\u65AD\uFF1A",
        "- \u54EA\u4E9B\u73A9\u5BB6\u5927\u6982\u7387\u53EF\u4FE1\uFF1F\u4E3A\u4EC0\u4E48\uFF1F",
        "- \u54EA\u4E9B\u73A9\u5BB6\u503C\u5F97\u6000\u7591\uFF1F\u4E3A\u4EC0\u4E48\uFF1F",
        "- \u54EA\u4E9B\u73A9\u5BB6\u7591\u4F3C\u6076\u9B54\u6216\u8005\u722A\u7259\uFF1F\u4E3A\u4EC0\u4E48\uFF1F",
        "6.\u3010\u660E\u65E5\u884C\u52A8\u8BA1\u5212\u3011",
        "- \u660E\u5929\u5E94\u8BE5\u91CD\u70B9\u8FFD\u95EE\u8C01\uFF1F\u8FFD\u95EE\u4EC0\u4E48\uFF1F",
        "- \u5E94\u8BE5\u63A8\u52A8\u63D0\u540D\u8C01\uFF1F",
        "- \u81EA\u5DF1\u4E0B\u4E00\u6B65\u8BE5\u600E\u4E48\u53D1\u8A00\uFF1F\uFF08\u662F\u5426\u4EAE\u660E\u8EAB\u4EFD\u3001\u662F\u5426\u5206\u4EAB\u66F4\u591A\u4FE1\u606F\u7B49\uFF09",
        "\u53EA\u8F93\u51FA\u603B\u7ED3\u5185\u5BB9\uFF0C\u4E0D\u8981\u8F93\u51FA\u5176\u4ED6\u4EFB\u4F55\u5185\u5BB9\u3002"
      ].join("\n");
    }
    const summaryPrompt = [
      { role: "system", content: summarySystemContent },
      { role: "user", content: `\u8BF7\u603B\u7ED3\u4F60\uFF08${player.name}\uFF09\u622A\u81F3\u767D\u5929${state.dayCount}\u7ED3\u675F\u7684\u6E38\u620F\u8BB0\u5F55\uFF1A

${historyText}` }
    ];
    try {
      const content = await callDeepSeek(summaryPrompt, 0.3, player, "summary", false);
      const summaryText = (content || "").trim();
      if (!summaryText) return;
      const summaryMsg = { role: "system", content: `[\u767D\u5929${state.dayCount}\u7ED3\u675F\u65F6\u7684\u6E38\u620F\u8FDB\u7A0B\u603B\u7ED3]
${summaryText}` };
      session.length = 0;
      session.push(...systemMsgs);
      session.push(summaryMsg);
      markActorPromptCursors(player, sessionKey);
      if (player.messageSessions && player.messageSessions["summary"]) {
        player.messageSessions["summary"] = [];
      }
    } catch (_) {
    }
  }
  async function compressDaySessions() {
    if (!state || !state.players) return;
    const aiPlayers = state.players.filter((p) => !p.isHuman);
    await Promise.all(aiPlayers.map((p) => compressPlayerSessions(p)));
  }

  // js/overlays.js
  var modalOverlay = document.getElementById("modalOverlay");
  var modalMessage = document.getElementById("modalMessage");
  var introOverlay = document.getElementById("introOverlay");
  var introVideo = document.getElementById("introVideo");
  var startOverlay = document.getElementById("startOverlay");
  var dawnOverlay = document.getElementById("dawnOverlay");
  var dawnText = document.getElementById("dawnText");
  function showModal(message) {
    if (!modalOverlay || !modalMessage) return;
    modalMessage.textContent = message;
    modalOverlay.classList.add("show");
  }
  function hideModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("show");
  }
  function finishIntroPlayback() {
    if (introOverlay) introOverlay.classList.remove("show");
    if (introVideo) {
      introVideo.pause();
      introVideo.currentTime = 0;
    }
    document.body.classList.remove("prestart");
    if (typeof window.syncAutoBgmForState === "function") {
      window.syncAutoBgmForState({ force: true });
    }
  }
  function startIntroPlayback() {
    if (startOverlay) startOverlay.classList.remove("show");
    if (introOverlay) introOverlay.classList.add("show");
    const bgmAudio2 = document.getElementById("bgmAudio");
    if (bgmAudio2 && !bgmAudio2.paused) {
      bgmAudio2.pause();
    }
    if (introVideo) {
      const playPromise = introVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          finishIntroPlayback();
        });
      }
    } else {
      finishIntroPlayback();
    }
  }
  var _dawnTypingTimer = null;
  var _dawnHideTimer = null;
  var _dawnSafetyTimer = null;
  function showDawnNarration(text) {
    if (!dawnOverlay || !dawnText) return;
    if (_dawnTypingTimer) {
      clearInterval(_dawnTypingTimer);
      _dawnTypingTimer = null;
    }
    if (_dawnHideTimer) {
      clearTimeout(_dawnHideTimer);
      _dawnHideTimer = null;
    }
    if (_dawnSafetyTimer) {
      clearTimeout(_dawnSafetyTimer);
      _dawnSafetyTimer = null;
    }
    const raw = (text || "").trim() || "\u5929\u4EAE\u4E86\u3002";
    const formatted = raw.replace(/([。！？!?])\s*/g, "$1\n").trim();
    const full = formatted.slice(0, 240);
    let idx = 0;
    dawnText.textContent = "";
    dawnOverlay.classList.add("show");
    const speed = 45;
    _dawnTypingTimer = setInterval(() => {
      idx += 1;
      dawnText.textContent = full.slice(0, idx);
      if (idx >= full.length) {
        clearInterval(_dawnTypingTimer);
        _dawnTypingTimer = null;
        _dawnHideTimer = setTimeout(() => {
          dawnOverlay.classList.remove("show");
          if (_dawnSafetyTimer) {
            clearTimeout(_dawnSafetyTimer);
            _dawnSafetyTimer = null;
          }
          _dawnHideTimer = null;
        }, 1400);
      }
    }, speed);
    const maxDuration = Math.min(9e3, Math.max(3500, full.length * speed + 1600));
    _dawnSafetyTimer = setTimeout(() => {
      dawnOverlay.classList.remove("show");
      if (_dawnTypingTimer) {
        clearInterval(_dawnTypingTimer);
        _dawnTypingTimer = null;
      }
      if (_dawnHideTimer) {
        clearTimeout(_dawnHideTimer);
        _dawnHideTimer = null;
      }
      _dawnSafetyTimer = null;
    }, maxDuration);
  }
  function initNotePicker() {
    const rolePicker = document.getElementById("noteRolePicker");
    const tagPicker = document.getElementById("noteTagPicker");
    let activePlayerId = null;
    const ROLE_NAMES = Object.keys(window.ROLE_STRATEGY_TIPS || {});
    const TAG_OPTIONS = [
      "\u5584\u826F",
      "\u90AA\u6076",
      "\u56FE\u7BA1\u5916\u6765\u8005",
      "\u730E\u624B\u5931\u53BB\u80FD\u529B",
      "\u50E7\u4FA3\u5B88\u62A4",
      "\u662F\u9152\u9B3C",
      "\u88AB\u6076\u9B54\u6740\u6B7B",
      "\u5E72\u6270\u9879",
      "\u4E2D\u6BD2",
      "\u7BA1\u5BB6\u7684\u4E3B\u4EBA",
      "\u6D17\u8863\u5987\u9547\u6C11",
      "\u5916\u6765\u8005",
      "\u81EA\u5B9A\u4E49\u7B14\u8BB0"
    ];
    function positionPicker(picker, anchorRect) {
      const pw = 260, ph = 320;
      let left = anchorRect.left + anchorRect.width / 2 - pw / 2;
      let top = anchorRect.bottom + 6;
      if (left < 8) left = 8;
      if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
      if (top + ph > window.innerHeight - 8) top = anchorRect.top - ph - 6;
      picker.style.left = left + "px";
      picker.style.top = top + "px";
    }
    function closeAll() {
      rolePicker.classList.remove("open");
      tagPicker.classList.remove("open");
      activePlayerId = null;
    }
    function getPlayer(id) {
      return state && state.players ? state.players.find((p) => p.id === id) : null;
    }
    window.openNoteRolePicker = function(playerId, anchorRect) {
      closeAll();
      activePlayerId = playerId;
      rolePicker.innerHTML = "";
      const clearBtn = document.createElement("span");
      clearBtn.className = "note-picker-item clear-item";
      clearBtn.textContent = "\u7A7A\u767D";
      clearBtn.addEventListener("click", () => {
        const p = getPlayer(activePlayerId);
        if (p) {
          p.noteRole = "";
          saveState();
          renderSeatCircle();
        }
        closeAll();
      });
      rolePicker.appendChild(clearBtn);
      ROLE_NAMES.forEach((name) => {
        const btn = document.createElement("span");
        btn.className = "note-picker-item";
        btn.textContent = name;
        btn.addEventListener("click", () => {
          const p = getPlayer(activePlayerId);
          if (p) {
            p.noteRole = name;
            saveState();
            renderSeatCircle();
          }
          closeAll();
        });
        rolePicker.appendChild(btn);
      });
      positionPicker(rolePicker, anchorRect);
      rolePicker.classList.add("open");
    };
    window.openNoteTagPicker = function(playerId, anchorRect) {
      closeAll();
      activePlayerId = playerId;
      tagPicker.innerHTML = "";
      TAG_OPTIONS.forEach((tag) => {
        const btn = document.createElement("span");
        btn.className = "note-picker-item";
        btn.textContent = tag;
        btn.addEventListener("click", () => {
          const p = getPlayer(activePlayerId);
          if (!p) {
            closeAll();
            return;
          }
          if (!Array.isArray(p.noteTags)) p.noteTags = [];
          if (tag === "\u81EA\u5B9A\u4E49\u7B14\u8BB0") {
            closeAll();
            const custom = prompt("\u8F93\u5165\u81EA\u5B9A\u4E49\u7B14\u8BB0\uFF1A");
            if (custom && custom.trim()) {
              p.noteTags.push(custom.trim());
              saveState();
              renderSeatCircle();
            }
            return;
          }
          if (!p.noteTags.includes(tag)) {
            p.noteTags.push(tag);
            saveState();
            renderSeatCircle();
          }
          closeAll();
        });
        tagPicker.appendChild(btn);
      });
      positionPicker(tagPicker, anchorRect);
      tagPicker.classList.add("open");
    };
    document.addEventListener("click", (e) => {
      if (!rolePicker.contains(e.target) && !tagPicker.contains(e.target) && !e.target.closest(".seat-node") && !e.target.closest(".seat-plus-btn")) {
        closeAll();
      }
    });
    document.addEventListener("click", (e) => {
      const plusBtn = e.target.closest(".seat-plus-btn");
      if (plusBtn) {
        e.stopPropagation();
        window.openNoteTagPicker(plusBtn.dataset.playerId, plusBtn.getBoundingClientRect());
      }
      const tagEl = e.target.closest(".seat-tag");
      if (tagEl) {
        e.stopPropagation();
        const p = getPlayer(tagEl.dataset.playerId);
        if (p && Array.isArray(p.noteTags)) {
          const idx = Number(tagEl.dataset.tagIdx);
          if (idx >= 0 && idx < p.noteTags.length) {
            p.noteTags.splice(idx, 1);
            saveState();
            renderSeatCircle();
          }
        }
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });
  }
  function initScriptBoard() {
    const overlay = document.getElementById("scriptBoardOverlay");
    const openBtn = document.getElementById("scriptBoardBtn");
    const closeBtn2 = document.getElementById("scriptBoardCloseBtn");
    if (overlay && openBtn) {
      openBtn.addEventListener("click", () => overlay.classList.add("open"));
      closeBtn2.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.classList.remove("open");
      });
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.classList.remove("open");
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("open")) overlay.classList.remove("open");
      });
    }
  }
  function renderSeatCircle() {
    if (typeof window.renderSeatCircle === "function") {
      window.renderSeatCircle();
    }
  }

  // js/voice.js
  var voiceStatus = document.getElementById("voiceStatus");
  var voiceBtn = document.getElementById("voiceBtn");
  var humanInput = document.getElementById("humanInput");
  var statementCaptureActive = false;
  var cancelStatementCapture = null;
  function pauseBgmForVoiceInput() {
    if (typeof window.pauseBgmForVoice === "function") {
      window.pauseBgmForVoice();
    }
  }
  function resumeBgmAfterVoiceInput() {
    if (typeof window.resumeBgmAfterVoice === "function") {
      window.resumeBgmAfterVoice();
    }
  }
  function updateVoiceUi(message = "", isError = false) {
    if (voiceStatus) {
      voiceStatus.textContent = message || "";
      voiceStatus.classList.toggle("error", Boolean(isError));
    }
    if (voiceBtn) {
      const active = speechActive || statementCaptureActive;
      voiceBtn.classList.toggle("active", active);
      voiceBtn.textContent = active ? "\u53D6\u6D88\u8BED\u97F3" : "\u8BED\u97F3\u8F93\u5165";
    }
  }
  function stopVoiceRecognition(message = "") {
    if (speechRecognition && speechActive) {
      try {
        speechRecognition.stop();
      } catch (error) {
      }
    }
    setSpeechActive(false);
    resumeBgmAfterVoiceInput();
    updateVoiceUi(message, false);
  }
  function initSpeechRecognition() {
    if (speechRecognition) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      if (voiceBtn) {
        voiceBtn.disabled = true;
        voiceBtn.textContent = "\u8BED\u97F3\u4E0D\u53EF\u7528";
      }
      updateVoiceUi("\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u8BED\u97F3\u8BC6\u522B\u3002", true);
      return;
    }
    setSpeechSupported(true);
    const rec = new SpeechRecognition();
    setSpeechRecognition(rec);
    rec.lang = "zh-CN";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onstart = () => {
      setSpeechActive(true);
      setSpeechInterim("");
      pauseBgmForVoiceInput();
      updateVoiceUi("\u6B63\u5728\u542C\u4F60\u8BF4\u8BDD\u2026");
    };
    rec.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i];
        if (res.isFinal) {
          finalText += res[0]?.transcript || "";
        } else {
          interimText += res[0]?.transcript || "";
        }
      }
      setSpeechInterim(interimText.trim());
      if (speechInterim) {
        updateVoiceUi(`\u8BC6\u522B\u4E2D\uFF1A${speechInterim}`);
      }
      const trimmed = finalText.trim();
      if (trimmed && humanInput) {
        humanInput.value = humanInput.value ? `${humanInput.value} ${trimmed}` : trimmed;
        updateVoiceUi("\u5DF2\u8F6C\u5199\u5230\u8F93\u5165\u6846\u3002");
      }
    };
    rec.onerror = (event) => {
      setSpeechActive(false);
      resumeBgmAfterVoiceInput();
      updateVoiceUi(`\u8BED\u97F3\u8BC6\u522B\u5931\u8D25\uFF1A${event.error || "\u672A\u77E5\u9519\u8BEF"}`, true);
    };
    rec.onend = () => {
      setSpeechActive(false);
      resumeBgmAfterVoiceInput();
      if (!voiceStatus?.classList.contains("error")) {
        updateVoiceUi("");
      } else {
        updateVoiceUi(voiceStatus.textContent, true);
      }
    };
  }
  function toggleVoiceInput() {
    if (typeof cancelStatementCapture === "function") {
      cancelStatementCapture();
      return;
    }
    if (!canUseVoiceInput()) {
      showModal2("\u5F53\u524D\u9636\u6BB5\u6682\u4E0D\u652F\u6301\u8BED\u97F3\u8F93\u5165\u3002");
      return;
    }
    initSpeechRecognition();
    if (!speechSupported || !speechRecognition) return;
    if (speechActive) {
      stopVoiceRecognition("\u5DF2\u505C\u6B62\u8BED\u97F3\u8F93\u5165\u3002");
      return;
    }
    updateVoiceUi("\u542F\u52A8\u8BED\u97F3\u8BC6\u522B\u2026");
    try {
      speechRecognition.start();
    } catch (error) {
      updateVoiceUi("\u8BED\u97F3\u8BC6\u522B\u542F\u52A8\u5931\u8D25\u3002", true);
    }
  }
  async function captureSpeechForStatement(title = "") {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return "";
    return await new Promise((resolve) => {
      let done = false;
      let finalText = "";
      const recognition = new SpeechRecognition();
      recognition.lang = "zh-CN";
      recognition.interimResults = true;
      recognition.continuous = false;
      const finish = (text = "") => {
        if (done) return;
        done = true;
        statementCaptureActive = false;
        cancelStatementCapture = null;
        try {
          recognition.onresult = null;
          recognition.onerror = null;
          recognition.onend = null;
          recognition.abort();
        } catch (error) {
        }
        resumeBgmAfterVoiceInput();
        resolve(String(text || "").trim());
      };
      recognition.onstart = () => {
        statementCaptureActive = true;
        cancelStatementCapture = () => {
          updateVoiceUi("\u5DF2\u53D6\u6D88\u8BED\u97F3\u8F93\u5165\u3002");
          finish("");
        };
        pauseBgmForVoiceInput();
        updateVoiceUi(title ? `${title}\uFF08\u8BED\u97F3\u8BC6\u522B\u4E2D\uFF0C\u518D\u70B9\u4E00\u6B21\u53EF\u53D6\u6D88\uFF09` : "\u8BED\u97F3\u8BC6\u522B\u4E2D\u2026\u518D\u6B21\u70B9\u51FB\u53EF\u53D6\u6D88");
      };
      recognition.onresult = (event) => {
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const res = event.results[i];
          if (res.isFinal) {
            finalText += res[0]?.transcript || "";
          } else {
            interimText += res[0]?.transcript || "";
          }
        }
        const interim = interimText.trim();
        if (interim) {
          updateVoiceUi(`\u8BC6\u522B\u4E2D\uFF1A${interim}`);
        }
      };
      recognition.onerror = () => {
        finish(finalText);
      };
      recognition.onend = () => {
        finish(finalText);
      };
      try {
        recognition.start();
      } catch (error) {
        statementCaptureActive = false;
        cancelStatementCapture = null;
        resumeBgmAfterVoiceInput();
        resolve("");
      }
    });
  }
  function canUseVoiceInput() {
    return typeof window.canUseVoiceInput === "function" ? window.canUseVoiceInput() : true;
  }
  function showModal2(msg) {
    showModal(msg);
  }

  // js/ui-helpers.js
  var _deps = {};
  function setUiDeps(deps) {
    Object.assign(_deps, deps);
  }
  var modelSelect;
  var tempInput;
  var dayDiscussionMinutesInput;
  var playerCountInput;
  var humanNameInput;
  var humanSeatInput;
  var humanRoleSelect;
  var setupBtn;
  var assignBtn;
  var startBtn;
  var randomModelBtn;
  var pauseBtn;
  var nightResolveBtn;
  var aiTalkBtn;
  var autoNightToggle;
  var trajectoryToggle;
  var forceNominationBtn;
  var voteBtn;
  var endBtn;
  var resetBtn;
  var exportBtn;
  var exportTrajBtn;
  var phaseStatus;
  var statusMetaChips;
  var nominationFlow;
  var townLayoutEl;
  var peekTownBtn;
  var peekLogBtn;
  var peekTownCloseBtn;
  var peekLogCloseBtn;
  var discussionOverlayBackdrop;
  var discussionLogDrawer;
  var playerList;
  var chatBox;
  var chatFilterSelect;
  var chatSearchInput;
  var chatAutoScrollBtn;
  var chatJumpLatestBtn;
  var chatResultHint;
  var chatTabPublicContent;
  var townRightEl;
  var townRightScrollEl;
  var discussionActionsEl;
  var privateChatBox;
  var privateTargetSelect;
  var privateInput;
  var privateSendBtn;
  var privateChatHint;
  var humanInput2;
  var mentionSelect;
  var mentionBtn;
  var slayerTemplateBtn;
  var voiceBtn2;
  var voiceStatus2;
  var chatLockHint;
  var slayerFormatHint;
  var sendBtn;
  var passBtn;
  var configSummaryBox;
  var modelHealthBox;
  var modelHealthRefreshBtn;
  var nominateBtn;
  var skipNominationBtn;
  var voteYesBtn;
  var voteNoBtn;
  var humanRoleBox;
  var humanPrivateBox;
  var humanActionBox;
  var logList;
  var publicLogList;
  var publicLogDrawerList;
  var replayPanel;
  var replayRoles;
  var replayActions;
  var replayPrivate;
  var replayChat;
  var taskSection;
  var taskTitle;
  var taskDesc;
  var taskHint;
  var storySummaryBtn;
  var storySummaryBox;
  var modalOverlay2;
  var modalMessage2;
  var modalCloseBtn;
  var nomineeSelect;
  var startOverlay2;
  var introOverlay2;
  var enterGameBtn;
  var skipIntroBtn;
  var introVideo2;
  var dawnOverlay2;
  var dawnText2;
  var saveApiKeysBtn;
  var clearApiKeysBtn;
  var apiKeysSection;
  var playerModelListEl;
  function initDomRefs() {
    modelSelect = document.getElementById("modelSelect");
    tempInput = document.getElementById("tempInput");
    dayDiscussionMinutesInput = document.getElementById("dayDiscussionMinutes");
    playerCountInput = document.getElementById("playerCount");
    humanNameInput = document.getElementById("humanName");
    humanSeatInput = document.getElementById("humanSeat");
    humanRoleSelect = document.getElementById("humanRoleSelect");
    setupBtn = document.getElementById("setupBtn");
    assignBtn = document.getElementById("assignBtn");
    startBtn = document.getElementById("startBtn");
    randomModelBtn = document.getElementById("randomModelBtn");
    pauseBtn = document.getElementById("pauseBtn");
    nightResolveBtn = document.getElementById("nightResolveBtn");
    aiTalkBtn = document.getElementById("aiTalkBtn");
    autoNightToggle = document.getElementById("autoNightToggle");
    trajectoryToggle = document.getElementById("trajectoryToggle");
    forceNominationBtn = document.getElementById("forceNominationBtn");
    voteBtn = document.getElementById("voteBtn");
    endBtn = document.getElementById("endBtn");
    resetBtn = document.getElementById("resetBtn");
    exportBtn = document.getElementById("exportBtn");
    exportTrajBtn = document.getElementById("exportTrajBtn");
    phaseStatus = document.getElementById("phaseStatus");
    statusMetaChips = document.getElementById("statusMetaChips");
    nominationFlow = document.getElementById("nominationFlow");
    townLayoutEl = document.getElementById("townLayout");
    peekTownBtn = document.getElementById("peekTownBtn");
    peekLogBtn = document.getElementById("peekLogBtn");
    peekTownCloseBtn = document.getElementById("peekTownCloseBtn");
    peekLogCloseBtn = document.getElementById("peekLogCloseBtn");
    discussionOverlayBackdrop = document.getElementById("discussionOverlayBackdrop");
    discussionLogDrawer = document.getElementById("discussionLogDrawer");
    playerList = document.getElementById("playerList");
    chatBox = document.getElementById("chatBox");
    chatFilterSelect = document.getElementById("chatFilterSelect");
    chatSearchInput = document.getElementById("chatSearchInput");
    chatAutoScrollBtn = document.getElementById("chatAutoScrollBtn");
    chatJumpLatestBtn = document.getElementById("chatJumpLatestBtn");
    chatResultHint = document.getElementById("chatResultHint");
    chatTabPublicContent = document.getElementById("chatTabContentPublic");
    townRightEl = document.querySelector(".town-right");
    townRightScrollEl = document.querySelector(".town-right-scroll");
    discussionActionsEl = document.getElementById("discussionActions");
    privateChatBox = document.getElementById("privateChatBox");
    privateTargetSelect = document.getElementById("privateTargetSelect");
    privateInput = document.getElementById("privateInput");
    privateSendBtn = document.getElementById("privateSendBtn");
    privateChatHint = document.getElementById("privateChatHint");
    humanInput2 = document.getElementById("humanInput");
    mentionSelect = document.getElementById("mentionSelect");
    mentionBtn = document.getElementById("mentionBtn");
    slayerTemplateBtn = document.getElementById("slayerTemplateBtn");
    voiceBtn2 = document.getElementById("voiceBtn");
    voiceStatus2 = document.getElementById("voiceStatus");
    chatLockHint = document.getElementById("chatLockHint");
    slayerFormatHint = document.getElementById("slayerFormatHint");
    sendBtn = document.getElementById("sendBtn");
    passBtn = document.getElementById("passBtn");
    configSummaryBox = document.getElementById("configSummaryBox");
    modelHealthBox = document.getElementById("modelHealthBox");
    modelHealthRefreshBtn = document.getElementById("modelHealthRefreshBtn");
    nominateBtn = document.getElementById("nominateBtn");
    skipNominationBtn = document.getElementById("skipNominationBtn");
    voteYesBtn = document.getElementById("voteYesBtn");
    voteNoBtn = document.getElementById("voteNoBtn");
    humanRoleBox = document.getElementById("humanRoleBox");
    humanPrivateBox = document.getElementById("humanPrivateBox");
    humanActionBox = document.getElementById("humanActionBox");
    logList = document.getElementById("logList");
    publicLogList = document.getElementById("publicLogList");
    publicLogDrawerList = document.getElementById("publicLogDrawerList");
    replayPanel = document.getElementById("replayPanel");
    replayRoles = document.getElementById("replayRoles");
    replayActions = document.getElementById("replayActions");
    replayPrivate = document.getElementById("replayPrivate");
    replayChat = document.getElementById("replayChat");
    taskSection = document.getElementById("taskSection");
    taskTitle = document.getElementById("taskTitle");
    taskDesc = document.getElementById("taskDesc");
    taskHint = document.getElementById("taskHint");
    storySummaryBtn = document.getElementById("storySummaryBtn");
    storySummaryBox = document.getElementById("storySummaryBox");
    modalOverlay2 = document.getElementById("modalOverlay");
    modalMessage2 = document.getElementById("modalMessage");
    modalCloseBtn = document.getElementById("modalCloseBtn");
    nomineeSelect = document.getElementById("nomineeSelect");
    startOverlay2 = document.getElementById("startOverlay");
    introOverlay2 = document.getElementById("introOverlay");
    enterGameBtn = document.getElementById("enterGameBtn");
    skipIntroBtn = document.getElementById("skipIntroBtn");
    introVideo2 = document.getElementById("introVideo");
    dawnOverlay2 = document.getElementById("dawnOverlay");
    dawnText2 = document.getElementById("dawnText");
    playerModelListEl = document.getElementById("playerModelList");
    saveApiKeysBtn = document.getElementById("saveApiKeysBtn");
    clearApiKeysBtn = document.getElementById("clearApiKeysBtn");
    apiKeysSection = document.getElementById("apiKeysSection");
  }
  function renderLog() {
    logList.innerHTML = "";
    logList.className = "timeline";
    state.log.forEach((entry) => {
      const item = document.createElement("div");
      item.className = `timeline-item${entry.type === "phase" ? " phase-entry" : ""}`;
      const { icon, cls } = _deps.getTimelineIcon(entry);
      item.innerHTML = `
      <span class="timeline-icon ${cls}">${icon}</span>
      <span class="timeline-text">[${entry.time}] ${entry.text}</span>
    `;
      logList.appendChild(item);
    });
  }
  function renderPublicLog() {
    const lists = [publicLogList, publicLogDrawerList].filter(Boolean);
    if (!lists.length) return;
    const entries = state.publicLog || [];
    lists.forEach((listEl) => {
      listEl.innerHTML = "";
      listEl.className = "timeline";
      if (!entries.length) {
        const item = document.createElement("div");
        item.className = "timeline-item";
        item.innerHTML = `<span class="timeline-icon">\u25CB</span><span class="timeline-text">\u6682\u65E0\u8BB0\u5F55\u3002</span>`;
        listEl.appendChild(item);
        return;
      }
      entries.forEach((entry) => {
        const item = document.createElement("div");
        let iconCls = "";
        let icon = "\u25CB";
        if (entry.text.includes("\u5904\u51B3")) {
          icon = "\u2694\uFE0F";
          iconCls = "execution";
        } else if (entry.text.includes("\u63D0\u540D")) {
          icon = "\u261D\uFE0F";
        } else if (entry.text.includes("\u6295\u7968")) {
          icon = "\u{1F5F3}\uFE0F";
        } else if (entry.text.includes("\u591C\u665A")) {
          icon = "\u{1F319}";
          iconCls = "night";
        }
        item.className = "timeline-item";
        item.innerHTML = `
        <span class="timeline-icon ${iconCls}">${icon}</span>
        <span class="timeline-text">[${entry.time}] ${entry.text}</span>
      `;
        listEl.appendChild(item);
      });
      listEl.scrollTop = listEl.scrollHeight;
    });
  }
  function renderPlayers() {
    playerList.innerHTML = "";
    state.players.forEach((player) => {
      const card = document.createElement("div");
      let cls = "player-card";
      if (!player.alive) cls += " dead";
      if (player.isHuman) cls += " self-player";
      const isDayPhase = state.started && !state.ended && state.phase === "day";
      if (isDayPhase && state.dayStage === "discussion" && state.currentSpeakerId === player.id) cls += " speaking";
      if (isDayPhase && state.dayStage === "nomination" && state.currentNomineeId === player.id) cls += " nominated";
      card.className = cls;
      const left = document.createElement("div");
      left.innerHTML = `${player.name} ${player.isHuman ? '<span style="color:var(--brass)">\xB7 \u4F60</span>' : ""}`;
      if (!player.isHuman) {
        const modelSelectEl = document.createElement("select");
        modelSelectEl.className = "player-model";
        const defaultOption = document.createElement("option");
        defaultOption.value = "default";
        defaultOption.textContent = "\u9ED8\u8BA4\u6A21\u578B";
        modelSelectEl.appendChild(defaultOption);
        MODEL_OPTIONS.forEach((option) => {
          const opt = document.createElement("option");
          opt.value = option.value;
          opt.textContent = option.label;
          modelSelectEl.appendChild(opt);
        });
        modelSelectEl.value = player.modelChoice || "default";
        modelSelectEl.addEventListener("change", () => {
          player.modelChoice = modelSelectEl.value;
          saveState();
        });
        left.appendChild(modelSelectEl);
      }
      const status = document.createElement("div");
      status.className = player.alive ? "chip chip-alive" : "chip chip-dead";
      status.textContent = player.alive ? "\u5B58\u6D3B" : "\u6B7B\u4EA1";
      card.appendChild(left);
      card.appendChild(status);
      playerList.appendChild(card);
    });
    nomineeSelect.innerHTML = "";
    state.players.forEach((player) => {
      const option = document.createElement("option");
      option.value = player.id;
      option.textContent = player.name + (player.alive ? "" : "\uFF08\u5DF2\u6B7B\u4EA1\uFF09");
      nomineeSelect.appendChild(option);
    });
    if (mentionSelect) {
      mentionSelect.innerHTML = "";
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "@ \u9009\u62E9\u73A9\u5BB6";
      mentionSelect.appendChild(placeholder);
      state.players.filter((p) => !p.isHuman).forEach((player) => {
        const option = document.createElement("option");
        option.value = player.id;
        option.textContent = player.name;
        mentionSelect.appendChild(option);
      });
    }
    if (chatFilterSelect) {
      const current = state.chatFilter || "all";
      chatFilterSelect.innerHTML = "";
      const allOption = document.createElement("option");
      allOption.value = "all";
      allOption.textContent = "\u5168\u90E8";
      chatFilterSelect.appendChild(allOption);
      state.players.forEach((player) => {
        const option = document.createElement("option");
        option.value = player.name;
        option.textContent = player.name;
        chatFilterSelect.appendChild(option);
      });
      const hasOption = Array.from(chatFilterSelect.options).some((opt) => opt.value === current);
      chatFilterSelect.value = hasOption ? current : "all";
      if (!hasOption) state.chatFilter = "all";
    }
    if (privateTargetSelect) {
      privateTargetSelect.innerHTML = "";
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "\u79C1\u804A\u76EE\u6807";
      privateTargetSelect.appendChild(placeholder);
      state.players.filter((p) => !p.isHuman).forEach((player) => {
        const option = document.createElement("option");
        option.value = player.id;
        option.textContent = player.name;
        privateTargetSelect.appendChild(option);
      });
    }
  }
  function insertTextAtCursor(tag) {
    if (!humanInput2 || !tag) return;
    const start = humanInput2.selectionStart || 0;
    const end = humanInput2.selectionEnd || 0;
    const text = humanInput2.value;
    humanInput2.value = text.slice(0, start) + tag + text.slice(end);
    const cursor = start + tag.length;
    humanInput2.setSelectionRange(cursor, cursor);
    humanInput2.focus();
  }
  function insertMention(name) {
    if (!name) return;
    insertTextAtCursor(`@${name} `);
  }
  function getPreferredSlayerSeat() {
    if (!state || !Array.isArray(state.players) || !state.players.length) return 1;
    if (mentionSelect && mentionSelect.value) {
      const mentioned = state.players.find((p) => p.id === mentionSelect.value);
      if (mentioned) {
        const seat = state.players.indexOf(mentioned) + 1;
        if (seat > 0) return seat;
      }
    }
    const human = state.players.find((p) => p.isHuman);
    const candidate = state.players.find((p) => p.alive && (!human || p.id !== human.id));
    if (!candidate) return 1;
    return state.players.indexOf(candidate) + 1;
  }
  function buildSlayerDeclarationTemplate(seat = null) {
    const seatNum = Number.isFinite(seat) ? seat : getPreferredSlayerSeat();
    return `\u6211\u662F\u730E\u624B\uFF0C\u6211\u8981\u5411\u73A9\u5BB6${seatNum}\u5F00\u67AA`;
  }
  function renderHumanInfo() {
    const human = state.players.find((p) => p.isHuman);
    if (!human || !human.roleId) {
      humanRoleBox.textContent = "\u5C1A\u672A\u5206\u914D\u89D2\u8272";
      return;
    }
    const role = getApparentRole(human);
    if (!role) {
      humanRoleBox.textContent = "\u89D2\u8272\u6570\u636E\u5F02\u5E38";
      humanPrivateBox.textContent = "\u6682\u65E0";
      return;
    }
    humanRoleBox.innerHTML = `
    <strong>${role.name}</strong> \xB7 ${role.team}<br />
    ${role.ability}
  `;
    humanPrivateBox.innerHTML = human.privateInfo.length ? human.privateInfo.map((line) => `<div>\u2022 ${line}</div>`).join("") : "\u6682\u65E0";
    renderHumanAction();
  }
  function renderHumanAction() {
    if (!state || !state.started) {
      humanActionBox.textContent = "\u672A\u5F00\u5C40";
      return;
    }
    const human = state.players.find((p) => p.isHuman);
    if (!human) {
      humanActionBox.textContent = "\u65E0\u73A9\u5BB6";
      return;
    }
    const role = getApparentRole(human);
    if (!role) {
      humanActionBox.textContent = "\u65E0\u591C\u665A\u884C\u52A8";
      return;
    }
    const nightActionRoles = /* @__PURE__ */ new Set(["\u5C0F\u6076\u9B54", "\u6295\u6BD2\u8005", "\u50E7\u4FA3", "\u7BA1\u5BB6", "\u5360\u535C\u5E08"]);
    if (nightActionRoles.has(role.name)) {
      if (state.phase !== "night") {
        humanActionBox.textContent = "\u591C\u665A\u5230\u6765\u540E\u53EF\u6267\u884C\u884C\u52A8\u3002";
        return;
      }
      if (!human.alive) {
        humanActionBox.textContent = "\u4F60\u5DF2\u6B7B\u4EA1\uFF0C\u65E0\u6CD5\u884C\u52A8\u3002";
        return;
      }
    }
    if (role.name === "\u5C0F\u6076\u9B54") {
      if (state.nightCount <= 1) {
        humanActionBox.textContent = "\u9996\u591C\u6076\u9B54\u4E0D\u6267\u884C\u6740\u4EBA\u884C\u52A8\u3002";
        return;
      }
      const allTargets = state.players.slice();
      const targetOptions2 = allTargets.map((p) => playerOptionHtml(p)).join("");
      humanActionBox.innerHTML = `
      <div class="hint">\u8BF7\u9009\u62E9\u6076\u9B54\u51FB\u6740\u76EE\u6807\uFF1A</div>
      <select id="humanTargetSelect">${targetOptions2}</select>
      <button class="secondary" id="humanTargetConfirmBtn" style="margin-top:8px">
        ${state.humanActionConfirmed ? "\u5DF2\u786E\u8BA4" : "\u786E\u8BA4\u51FB\u6740"}
      </button>
    `;
      const select = humanActionBox.querySelector("#humanTargetSelect");
      const confirmBtn = humanActionBox.querySelector("#humanTargetConfirmBtn");
      select.value = state.humanActionTarget || select.options[0]?.value || "";
      select.disabled = state.humanActionConfirmed;
      confirmBtn.disabled = state.humanActionConfirmed;
      select.addEventListener("change", () => {
        state.humanActionTarget = select.value;
        state.humanActionConfirmed = false;
        saveState();
      });
      confirmBtn.addEventListener("click", () => {
        state.humanActionTarget = select.value;
        state.humanActionConfirmed = true;
        saveState();
        _deps.scheduleAutoNight();
        renderHumanAction();
      });
      return;
    }
    if (role.name === "\u730E\u624B") {
      if (!human.alive) {
        humanActionBox.textContent = "\u4F60\u5DF2\u6B7B\u4EA1\uFF0C\u65E0\u6CD5\u53D1\u52A8\u730E\u624B\u6280\u80FD\u3002";
        return;
      }
      if (state.phase !== "day" || state.dayStage !== "discussion") {
        humanActionBox.textContent = human.slayerUsed ? "\u730E\u624B\u6280\u80FD\u5DF2\u4F7F\u7528\u3002" : "\u767D\u5929\u8BA8\u8BBA\u9636\u6BB5\u53EF\u53D1\u52A8\u730E\u624B\u5C04\u51FB\u3002";
        return;
      }
      if (human.slayerUsed) {
        humanActionBox.textContent = "\u730E\u624B\u6280\u80FD\u5DF2\u4F7F\u7528\u3002";
        return;
      }
      const targets = state.players.filter((p) => p.alive && p.id !== human.id);
      const options = targets.map((p) => playerOptionHtml(p)).join("");
      humanActionBox.innerHTML = `
      <div class="hint">\u771F\u5B9E\u730E\u624B\u8BF7\u5728\u6B64\u9009\u62E9\u76EE\u6807\u5E76\u70B9\u51FB\u201C\u5F00\u67AA\u201D\u3002\u5176\u4ED6\u73A9\u5BB6\u53EA\u80FD\u7528\u804A\u5929\u683C\u5F0F\u5BA3\u79F0\u5F00\u67AA\u3002</div>
      <div class="hint" style="margin-top:6px">\u730E\u624B\u5C04\u51FB\u76EE\u6807\uFF1A</div>
      <select id="slayerTargetSelect">${options}</select>
      <button class="secondary" id="slayerShootBtn" style="margin-top:8px">\u5F00\u67AA</button>
    `;
      const select = humanActionBox.querySelector("#slayerTargetSelect");
      const button = humanActionBox.querySelector("#slayerShootBtn");
      button.addEventListener("click", () => {
        const target = state.players.find((p) => p.id === select.value);
        if (!target) return;
        _deps.useSlayerShot(human, target);
      });
      return;
    }
    const allowSelf = role.name === "\u5C0F\u6076\u9B54";
    const baseTargets = role.name === "\u5C0F\u6076\u9B54" || role.name === "\u6295\u6BD2\u8005" ? state.players.slice() : state.players.filter((p) => p.alive);
    const filteredTargets = baseTargets.filter((p) => allowSelf || p.id !== human.id);
    const targetOptions = filteredTargets.map((p) => playerOptionHtml(p)).join("");
    if (role.name === "\u50E7\u4FA3" && state.nightCount === 1) {
      humanActionBox.textContent = "\u9996\u591C\u50E7\u4FA3\u4E0D\u6267\u884C\u5B88\u62A4\u3002";
      return;
    }
    if (role.name === "\u50E7\u4FA3" || role.name === "\u6295\u6BD2\u8005" || role.name === "\u7BA1\u5BB6") {
      const actionLabel = role.name === "\u50E7\u4FA3" ? "\u5B88\u62A4" : role.name === "\u6295\u6BD2\u8005" ? "\u6295\u6BD2" : "\u4F8D\u4ECE";
      humanActionBox.innerHTML = `
      <div class="hint">\u8BF7\u9009\u62E9\u76EE\u6807\uFF1A</div>
      <select id="humanTargetSelect">${targetOptions}</select>
      <button class="secondary" id="humanTargetConfirmBtn" style="margin-top:8px">
        ${state.humanActionConfirmed ? "\u5DF2\u786E\u8BA4" : `\u786E\u8BA4${actionLabel}`}
      </button>
    `;
      const select = humanActionBox.querySelector("#humanTargetSelect");
      const confirmBtn = humanActionBox.querySelector("#humanTargetConfirmBtn");
      select.value = state.humanActionTarget || select.options[0]?.value || "";
      select.disabled = state.humanActionConfirmed;
      confirmBtn.disabled = state.humanActionConfirmed;
      select.addEventListener("change", () => {
        state.humanActionTarget = select.value;
        state.humanActionConfirmed = false;
        saveState();
        _deps.scheduleAutoNight();
      });
      confirmBtn.addEventListener("click", () => {
        state.humanActionTarget = select.value;
        state.humanActionConfirmed = true;
        saveState();
        _deps.scheduleAutoNight();
        renderHumanAction();
      });
      return;
    }
    if (role.name === "\u5360\u535C\u5E08") {
      const ftTargets = state.players.filter((p) => p.alive);
      const ftOptions = ftTargets.map((p) => playerOptionHtml(p)).join("");
      humanActionBox.innerHTML = `
      <div class="hint">\u8BF7\u9009\u62E9\u4E24\u540D\u76EE\u6807\uFF1A</div>
      <select id="humanTargetSelect">${ftOptions}</select>
      <select id="humanTargetSelect2" style="margin-top:8px">${ftOptions}</select>
      <button class="secondary" id="humanTargetConfirmBtn" style="margin-top:8px">
        ${state.humanActionConfirmed ? "\u5DF2\u786E\u8BA4" : "\u786E\u8BA4\u5360\u535C"}
      </button>
    `;
      const select1 = humanActionBox.querySelector("#humanTargetSelect");
      const select2 = humanActionBox.querySelector("#humanTargetSelect2");
      const confirmBtn = humanActionBox.querySelector("#humanTargetConfirmBtn");
      const pickAlternate = (current) => {
        const options = Array.from(select2.options).map((o) => o.value);
        const alt = options.find((value) => value !== current);
        return alt || current;
      };
      select1.value = state.humanActionTarget || select1.options[0]?.value || "";
      select2.value = state.humanActionTarget2 || select2.options[1]?.value || pickAlternate(select1.value);
      if (select1.value === select2.value) {
        select2.value = pickAlternate(select1.value);
      }
      select1.disabled = state.humanActionConfirmed;
      select2.disabled = state.humanActionConfirmed;
      confirmBtn.disabled = state.humanActionConfirmed;
      select1.addEventListener("change", () => {
        state.humanActionTarget = select1.value;
        if (select1.value === select2.value) {
          select2.value = pickAlternate(select1.value);
          state.humanActionTarget2 = select2.value;
        }
        state.humanActionConfirmed = false;
        saveState();
        _deps.scheduleAutoNight();
      });
      select2.addEventListener("change", () => {
        state.humanActionTarget2 = select2.value;
        if (select1.value === select2.value) {
          select1.value = pickAlternate(select2.value);
          state.humanActionTarget = select1.value;
        }
        state.humanActionConfirmed = false;
        saveState();
        _deps.scheduleAutoNight();
      });
      confirmBtn.addEventListener("click", () => {
        state.humanActionTarget = select1.value;
        state.humanActionTarget2 = select2.value;
        if (select1.value === select2.value) {
          select2.value = pickAlternate(select1.value);
          state.humanActionTarget2 = select2.value;
        }
        state.humanActionConfirmed = true;
        saveState();
        _deps.scheduleAutoNight();
        renderHumanAction();
      });
      return;
    }
    humanActionBox.textContent = "\u65E0\u591C\u665A\u884C\u52A8";
  }
  function renderPhaseProgress(container) {
    if (!container || !state) {
      container.innerHTML = "";
      return;
    }
    if (!state.started) {
      container.innerHTML = "";
      return;
    }
    const steps = [];
    for (let n = 1; n <= state.nightCount; n++) {
      steps.push({ label: `\u591C${n}`, type: "night", idx: n });
      if (n <= state.dayCount) {
        steps.push({ label: `\u65E5${n}`, type: "day", idx: n });
      }
    }
    if (state.phase === "day" && state.dayCount > state.nightCount) {
      steps.push({ label: `\u65E5${state.dayCount}`, type: "day", idx: state.dayCount });
    }
    let html = "";
    steps.forEach((step, i) => {
      const isCurrent = step.type === "night" && state.phase === "night" && step.idx === state.nightCount || step.type === "day" && state.phase === "day" && step.idx === state.dayCount;
      const isPast = !isCurrent && (step.type === "night" && (step.idx < state.nightCount || step.idx === state.nightCount && state.phase === "day") || step.type === "day" && step.idx < state.dayCount);
      const dotCls = isCurrent ? "active" : isPast ? "completed" : "";
      if (i > 0) {
        html += `<span class="phase-step-line${isPast || isCurrent ? " completed" : ""}"></span>`;
      }
      html += `<span class="phase-step"><span class="phase-step-dot ${dotCls}"></span><span class="phase-step-label">${step.label}</span></span>`;
    });
    container.innerHTML = html;
  }
  function renderStatusMeta(items) {
    if (!statusMetaChips) return;
    statusMetaChips.innerHTML = "";
    if (!Array.isArray(items) || !items.length) return;
    items.forEach((text) => {
      const chip = document.createElement("span");
      chip.className = "status-pill";
      chip.textContent = text;
      statusMetaChips.appendChild(chip);
    });
  }
  function renderNominationFlow() {
    if (!nominationFlow || !state) return;
    const visible = state.started && !state.ended && state.phase === "day" && state.dayStage === "nomination";
    nominationFlow.innerHTML = "";
    nominationFlow.style.display = visible ? "flex" : "none";
    if (!visible) return;
    const order = ["open", "reason", "defense", "voting"];
    const labels = ["\u63D0\u540D", "\u7406\u7531", "\u8FA9\u89E3", "\u6295\u7968"];
    const phase = order.includes(state.nominationPhase) ? state.nominationPhase : "open";
    const activeIndex = order.indexOf(phase);
    labels.forEach((label, index) => {
      const step = document.createElement("span");
      let cls = "nomination-step";
      if (index < activeIndex) cls += " done";
      if (index === activeIndex) cls += " active";
      step.className = cls;
      step.textContent = label;
      nominationFlow.appendChild(step);
      if (index < labels.length - 1) {
        const line = document.createElement("span");
        line.className = "nomination-flow-line";
        nominationFlow.appendChild(line);
      }
    });
  }
  function renderTaskCardStatus() {
    if (!taskSection || !taskTitle || !taskDesc || !taskHint || !state) return;
    const human = state.players.find((p) => p.isHuman);
    let title = "\u7B49\u5F85\u5F00\u5C40";
    let desc = "\u8BF7\u5148\u751F\u6210\u73A9\u5BB6\u5E76\u968F\u673A\u53D1\u724C\u3002";
    let hint = "\u5EFA\u8BAE\u987A\u5E8F\uFF1A\u751F\u6210\u73A9\u5BB6 -> \u968F\u673A\u53D1\u724C -> \u5F00\u5C40\u3002";
    if (!state.started) {
      taskSection.style.display = "";
      taskTitle.textContent = title;
      taskDesc.textContent = desc;
      taskHint.textContent = hint;
      return;
    }
    if (state.ended) {
      title = state.postGameChat ? "\u8D5B\u540E\u804A\u5929" : "\u6E38\u620F\u7ED3\u675F";
      desc = state.postGameChat ? `\u53EF\u7EE7\u7EED\u53D1\u8A00\u6216\u70B9\u51FB\u201CAI\u8F6E\u8F6C\u201D\u8FDB\u884C\u8D5B\u540E\u4EA4\u6D41\u3002` : "\u4F60\u53EF\u4EE5\u5BFC\u51FA\u590D\u76D8\u4E0E\u8F68\u8FF9\uFF0C\u6216\u91CD\u7F6E\u5F00\u59CB\u4E0B\u4E00\u5C40\u3002";
      hint = "\u5EFA\u8BAE\uFF1A\u5148\u5BFC\u51FA\u590D\u76D8\uFF0C\u518D\u91CD\u7F6E\u3002";
      taskTitle.textContent = title;
      taskDesc.textContent = desc;
      taskHint.textContent = hint;
      return;
    }
    if (state.phase === "night") {
      if (_deps.needsHumanNightAction() && !_deps.isHumanActionReady()) {
        title = "\u8BF7\u5B8C\u6210\u4F60\u7684\u591C\u665A\u884C\u52A8";
        desc = `\u5728\u201C\u4F60\u7684\u591C\u665A\u884C\u52A8\u201D\u9762\u677F\u4E2D\u9009\u62E9\u76EE\u6807\u5E76\u786E\u8BA4\uFF0C\u7136\u540E\u7B49\u5F85\u7ED3\u7B97\u3002`;
        hint = "\u672A\u786E\u8BA4\u524D\u4E0D\u4F1A\u81EA\u52A8\u8FDB\u5165\u5929\u4EAE\u3002";
      } else {
        title = "\u7B49\u5F85\u591C\u665A\u7ED3\u7B97";
        desc = autoNightToggle.checked ? "\u7CFB\u7EDF\u5C06\u81EA\u52A8\u7ED3\u7B97\u591C\u665A\u6D41\u7A0B\u3002" : `\u70B9\u51FB\u201C\u591C\u665A\u7ED3\u7B97\u201D\u63A8\u8FDB\u5230\u5929\u4EAE\u3002`;
        hint = "\u591C\u665A\u4FE1\u606F\u4F1A\u5728\u5929\u4EAE\u540E\u516C\u5E03\u3002";
      }
      taskTitle.textContent = title;
      taskDesc.textContent = desc;
      taskHint.textContent = hint;
      return;
    }
    if (state.evilChatPhase) {
      const isHumanEvil = human && (human.team === "minion" || human.team === "demon");
      if (isHumanEvil) {
        title = "\u90AA\u6076\u9635\u8425\u5BC6\u804A\u4E2D";
        desc = "\u4F60\u6B63\u5728\u4E0E\u90AA\u6076\u540C\u4F34\u5BC6\u804A\uFF0C\u534F\u5546\u7B56\u7565\u3002";
        hint = "\u5BC6\u804A\u7ED3\u675F\u540E\u5C06\u8FDB\u5165\u516C\u5F00\u8BA8\u8BBA\u3002";
      } else {
        title = "\u90AA\u6076\u9635\u8425\u5BC6\u804A\u4E2D";
        desc = "\u90AA\u6076\u9635\u8425\u6B63\u5728\u5BC6\u804A\u4E2D\uFF0C\u8BF7\u8010\u5FC3\u7B49\u5F85\u3002";
        hint = "\u6B64\u9636\u6BB5\u4F60\u65E0\u6CD5\u53D1\u8A00\uFF0C\u5BC6\u804A\u7ED3\u675F\u540E\u5C06\u8FDB\u5165\u516C\u5F00\u8BA8\u8BBA\u3002";
      }
      taskTitle.textContent = title;
      taskDesc.textContent = desc;
      taskHint.textContent = hint;
      return;
    }
    if (state.dayStage === "discussion") {
      const speaker = state.players.find((p) => p.id === state.currentSpeakerId);
      if (speaker && human && speaker.id === human.id) {
        title = "\u8F6E\u5230\u4F60\u53D1\u8A00";
        desc = "\u5728\u8F93\u5165\u6846\u4E2D\u53D1\u8A00\uFF0C\u6216\u70B9\u51FB\u300C\u8DF3\u8FC7\u8BA8\u8BBA\u300D\u8FDB\u5165\u63D0\u540D\u9636\u6BB5\u3002";
        hint = "\u5FEB\u6377\u64CD\u4F5C\uFF1A\u56DE\u8F66\u53D1\u9001\u3002";
      } else if (speaker) {
        title = `\u7B49\u5F85 ${speaker.name} \u53D1\u8A00`;
        desc = "\u4F60\u53EF\u4EE5\u89C2\u5BDF\u516C\u5F00\u804A\u5929\uFF0C\u5E76\u51C6\u5907\u63D0\u540D\u9636\u6BB5\u7684\u7B56\u7565\u3002";
        hint = "\u82E5\u8BA8\u8BBA\u8D85\u65F6\uFF0C\u5C06\u81EA\u52A8\u8FDB\u5165\u63D0\u540D\u3002";
      } else {
        title = "\u81EA\u7531\u8BA8\u8BBA\u4E2D";
        desc = "\u5173\u6CE8\u516C\u5F00\u804A\u5929\u4E2D\u7684\u8EAB\u4EFD\u58F0\u660E\u4E0E\u77DB\u76FE\u70B9\u3002";
        hint = "\u4FE1\u606F\u4F4D\u5148\u4FDD\u7559\uFF0C\u63D0\u540D\u524D\u96C6\u4E2D\u68B3\u7406\u3002";
      }
      taskTitle.textContent = title;
      taskDesc.textContent = desc;
      taskHint.textContent = hint;
      return;
    }
    if (state.dayStage === "nomination") {
      const nominee = state.players.find((p) => p.id === state.currentNomineeId);
      const humanCanNominate = human && human.alive && state.nominationPhase === "open" && !state.humanNominationDone && !state.nominationUsedIds.includes(human.id);
      const humanCanVote = human && state.nominationPhase === "voting" && state.currentVoterId === human.id && !state.humanVoted && (human.alive || !human.deadVoteUsed);
      if (state.nominationPhase === "open") {
        title = humanCanNominate ? "\u4F60\u53EF\u4EE5\u63D0\u540D" : "\u63D0\u540D\u8F6E\u8F6C\u4E2D";
        desc = humanCanNominate ? "\u9009\u62E9\u4E00\u540D\u5B58\u6D3B\u73A9\u5BB6\u5E76\u63D0\u4EA4\u63D0\u540D\uFF0C\u6216\u8DF3\u8FC7\u3002" : "\u7B49\u5F85\u5176\u4ED6\u73A9\u5BB6\u5B8C\u6210\u63D0\u540D\u3002";
        hint = `\u4ECA\u65E5\u63D0\u540D\uFF1A${state.dayNominationCount}`;
      } else if (state.nominationPhase === "reason") {
        title = "\u63D0\u540D\u7406\u7531\u9636\u6BB5";
        desc = nominee ? `\u56F4\u7ED5\u201C${nominee.name}\u201D\u7684\u63D0\u540D\u7406\u7531\u9648\u8FF0\u4E2D\u3002` : "\u63D0\u540D\u7406\u7531\u9648\u8FF0\u4E2D\u3002";
        hint = "\u516C\u5F00\u53D1\u8A00\u9636\u6BB5\uFF0C\u6CE8\u610F\u4FE1\u606F\u4E00\u81F4\u6027\u3002";
      } else if (state.nominationPhase === "defense") {
        title = "\u88AB\u63D0\u540D\u4EBA\u8FA9\u89E3";
        desc = nominee ? `${nominee.name} \u6B63\u5728\u8FDB\u884C\u8FA9\u89E3\u3002` : "\u88AB\u63D0\u540D\u4EBA\u8FA9\u89E3\u4E2D\u3002";
        hint = "\u8FA9\u89E3\u7ED3\u675F\u540E\u5C06\u8FDB\u5165\u6295\u7968\u3002";
      } else if (state.nominationPhase === "voting") {
        title = humanCanVote ? "\u8F6E\u5230\u4F60\u6295\u7968" : "\u6295\u7968\u8FDB\u884C\u4E2D";
        desc = nominee ? `\u8BF7\u5BF9\u201C${nominee.name}\u201D\u4F5C\u51FA\u8D5E\u6210\u6216\u53CD\u5BF9\u3002` : "\u8BF7\u5B8C\u6210\u672C\u8F6E\u6295\u7968\u3002";
        hint = humanCanVote ? "\u5FEB\u6377\u952E\uFF1AY=\u8D5E\u6210\uFF0CN=\u53CD\u5BF9\u3002" : `\u7B49\u5F85\u5176\u4ED6\u73A9\u5BB6\u6295\u7968\uFF08\u5269\u4F59AI\uFF1A${state.pendingAiVotes || 0}\uFF09\u3002`;
      } else {
        title = "\u63D0\u540D\u9636\u6BB5";
        desc = "\u6B63\u5728\u5904\u7406\u63D0\u540D\u6D41\u7A0B\u3002";
        hint = "\u8BF7\u7B49\u5F85\u6D41\u7A0B\u63A8\u8FDB\u3002";
      }
    }
    taskTitle.textContent = title;
    taskDesc.textContent = desc;
    taskHint.textContent = hint;
  }
  function renderStatus() {
    const label = getPhaseLabel();
    let extra = "";
    if (state.started && state.ended && state.postGameChat) {
      extra = "\u8D5B\u540E\u804A\u5929";
    } else if (state.started && state.phase === "day") {
      extra = state.evilChatPhase ? "\u90AA\u6076\u9635\u8425\u5BC6\u804A\u4E2D" : state.dayStage === "discussion" ? "\u8BA8\u8BBA\u4E2D" : "\u63D0\u540D\u9636\u6BB5";
      if (state.dayStage === "discussion" && state.discussionMaxRemaining > 0) {
        const mins = Math.floor(state.discussionMaxRemaining / 60);
        const secs = state.discussionMaxRemaining % 60;
        extra += ` \xB7 \u5269\u4F59${mins}\u5206${String(secs).padStart(2, "0")}\u79D2`;
      }
      if (state.dayStage === "nomination" && state.currentNomineeId) {
        const nominee = state.players.find((p) => p.id === state.currentNomineeId);
        if (nominee) {
          extra += ` \xB7 \u5DF2\u63D0\u540D${nominee.name}`;
        }
      }
      if (state.dayStage === "nomination") {
        if (state.nominationPhase === "open" && state.currentSpeakerId) {
          const speaker = state.players.find((p) => p.id === state.currentSpeakerId);
          if (speaker) {
            extra += ` \xB7 \u8F6E\u5230${speaker.isHuman ? "\u4F60" : speaker.name}\u63D0\u540D`;
          }
        }
        if (state.nominationPhase === "reason") {
          extra += " \xB7 \u63D0\u540D\u7406\u7531";
        }
        if (state.nominationPhase === "defense") {
          extra += " \xB7 \u88AB\u63D0\u540D\u4EBA\u8FA9\u89E3";
        }
        if (state.nominationPhase === "voting") {
          extra += " \xB7 \u6295\u7968\u4E2D";
          const voter = state.players.find((p) => p.id === state.currentVoterId);
          if (voter && voter.isHuman && !state.humanVoted) {
            extra += " \xB7 \u7B49\u5F85\u4F60\u6295\u7968";
          }
          if (state.voteCountdown > 0) {
            extra += ` \xB7 \u5012\u8BA1\u65F6${state.voteCountdown}s`;
          }
        }
      }
    } else if (state.started && state.phase === "night") {
      if (_deps.needsHumanNightAction() && !_deps.isHumanActionReady()) {
        extra = "\u7B49\u5F85\u4F60\u9009\u62E9\u591C\u665A\u76EE\u6807";
      } else if (autoNightToggle.checked) {
        extra = "\u81EA\u52A8\u7ED3\u7B97\u4E2D \xB7 \u8BF7\u7B49\u5F85\u8BF4\u4E66\u4EBA\u5BA3\u5E03\u5929\u4EAE";
      } else {
        extra = "\u8BF7\u7B49\u5F85\u8BF4\u4E66\u4EBA\u5BA3\u5E03\u5929\u4EAE";
      }
    }
    if (state.started && state.paused) {
      extra = extra ? `${extra} \xB7 \u5DF2\u6682\u505C` : "\u5DF2\u6682\u505C";
    }
    if (typeof window.syncAutoBgmForState === "function") {
      window.syncAutoBgmForState();
    }
    const phaseStatusText = document.getElementById("phaseStatusText");
    if (phaseStatusText) {
      phaseStatusText.textContent = extra ? `${label} \xB7 ${extra}` : label;
    } else {
      phaseStatus.textContent = extra ? `${label} \xB7 ${extra}` : label;
    }
    document.body.classList.remove("phase-night", "phase-day", "phase-dusk");
    if (state.started && !state.ended) {
      if (state.phase === "night") {
        document.body.classList.add("phase-night");
      } else if (state.phase === "day" && state.dayStage === "nomination") {
        document.body.classList.add("phase-dusk");
      } else {
        document.body.classList.add("phase-day");
      }
    }
    const countdownRing = document.getElementById("countdownRing");
    const countdownRingFg = document.getElementById("countdownRingFg");
    const countdownRingText = document.getElementById("countdownRingText");
    if (countdownRing && countdownRingFg && countdownRingText) {
      const hasCountdown = state.phase === "day" && state.dayStage === "discussion" && state.discussionMaxRemaining > 0;
      countdownRing.style.display = hasCountdown ? "inline-flex" : "none";
      if (hasCountdown) {
        const duration = getDiscussionDurationSeconds();
        const ratio = duration > 0 ? state.discussionMaxRemaining / duration : 0;
        const circumference = 81.68;
        countdownRingFg.style.strokeDashoffset = circumference * (1 - ratio);
        const mins = Math.floor(state.discussionMaxRemaining / 60);
        const secs = state.discussionMaxRemaining % 60;
        countdownRingText.textContent = `${mins}:${String(secs).padStart(2, "0")}`;
      }
    }
    const progressEl = document.getElementById("phaseProgress");
    if (progressEl) {
      renderPhaseProgress(progressEl);
    }
    renderNominationFlow();
    const nightOverlay = document.getElementById("nightOverlay");
    const discussionBtnGroup = document.getElementById("discussionBtnGroup");
    const nominationBtnGroup = document.getElementById("nominationBtnGroup");
    const voteBtnGroup = document.getElementById("voteBtnGroup");
    const voteCountdownDisplay = document.getElementById("voteCountdownDisplay");
    const isNight = state.started && !state.ended && state.phase === "night";
    const isDiscussion = state.started && !state.ended && state.phase === "day" && state.dayStage === "discussion";
    const isPostGameChat = state.started && state.ended && state.postGameChat;
    const isNomination = state.started && !state.ended && state.phase === "day" && state.dayStage === "nomination" && state.nominationPhase === "open";
    const isVoting = state.started && !state.ended && state.phase === "day" && state.dayStage === "nomination" && state.nominationPhase === "voting";
    const discussionFocus = isDiscussion;
    if (townLayoutEl) {
      const wasFocus = townLayoutEl.classList.contains("discussion-focus");
      townLayoutEl.classList.toggle("discussion-focus", discussionFocus);
      if (typeof _deps.applyDiscussionDrawers === "function") _deps.applyDiscussionDrawers();
      if (wasFocus !== discussionFocus) {
        if (typeof _deps.scheduleChatRelock === "function") _deps.scheduleChatRelock(420);
      }
    }
    if (nightOverlay) nightOverlay.className = isNight ? "night-overlay visible" : "night-overlay";
    const showDiscussionActions = isDiscussion || isPostGameChat;
    if (discussionActionsEl) {
      const wasVisible = discussionActionsEl.style.display !== "none";
      discussionActionsEl.style.display = showDiscussionActions ? "" : "none";
      if (showDiscussionActions !== wasVisible) {
        if (typeof _deps.scheduleChatRelock === "function") _deps.scheduleChatRelock(360);
      }
    }
    if (discussionBtnGroup) discussionBtnGroup.className = showDiscussionActions ? "action-group visible" : "action-group";
    if (nominationBtnGroup) nominationBtnGroup.className = isNomination ? "action-group visible" : "action-group";
    if (voteBtnGroup) voteBtnGroup.className = isVoting ? "vote-actions visible" : "vote-actions";
    if (voteCountdownDisplay) {
      voteCountdownDisplay.textContent = state.voteCountdown > 0 ? `${state.voteCountdown}s` : "";
    }
    nightResolveBtn.disabled = !state.started || state.ended || state.phase !== "night";
    const canAiTalk = state.started && !state.paused && (state.phase === "day" && state.dayStage === "discussion" && !state.ended || isPostGameChat);
    aiTalkBtn.disabled = !canAiTalk || state.postGameInProgress;
    voteBtn.disabled = !state.started || state.ended || state.phase !== "day" || state.dayStage !== "nomination" || !state.currentNomineeId || state.nominationPhase !== "voting";
    forceNominationBtn.disabled = !state.started || state.ended || state.phase !== "day" || state.dayStage !== "discussion" || state.evilChatPhase;
    const human = state.players.find((p) => p.isHuman);
    const humanEligibleToNominate = human && human.alive && !state.humanNominationDone && !state.nominationUsedIds.includes(human.id);
    const humanTurnToNominate = state.phase === "day" && state.dayStage === "nomination" && state.nominationPhase === "open" && humanEligibleToNominate;
    nominateBtn.disabled = !state.started || state.ended || !humanTurnToNominate;
    skipNominationBtn.disabled = !state.started || state.ended || !humanTurnToNominate;
    const humanEligibleToVoteYes = human && (human.alive || !human.alive && !human.deadVoteUsed);
    const humanTurnToVote = state.phase === "day" && state.dayStage === "nomination" && state.nominationPhase === "voting" && human && state.currentVoterId === human.id;
    voteYesBtn.disabled = !state.started || state.ended || !humanTurnToVote || state.humanVoted || !humanEligibleToVoteYes;
    voteNoBtn.disabled = !state.started || state.ended || !humanTurnToVote || state.humanVoted;
    endBtn.disabled = !state.started || state.ended;
    passBtn.disabled = !state.started || state.ended || state.phase !== "day" || state.dayStage !== "discussion" || state.evilChatPhase;
    const allowPostGameChat = state.started && state.ended && state.postGameChat;
    const nominationBlocksChat = state.dayStage === "nomination" && !allowPostGameChat;
    const humanIsGood = human && human.team !== "minion" && human.team !== "demon";
    const evilChatBlocksChat = state.evilChatPhase && humanIsGood;
    const chatBlocked = nominationBlocksChat || evilChatBlocksChat;
    if (chatLockHint) {
      chatLockHint.style.display = chatBlocked ? "" : "none";
      if (evilChatBlocksChat) {
        chatLockHint.textContent = "\u90AA\u6076\u9635\u8425\u5BC6\u804A\u4E2D\uFF0C\u5584\u826F\u73A9\u5BB6\u65E0\u6CD5\u53D1\u8A00\uFF0C\u8BF7\u7B49\u5F85\u5BC6\u804A\u7ED3\u675F\u3002";
      } else if (nominationBlocksChat) {
        chatLockHint.textContent = "\u63D0\u540D/\u6295\u7968\u9636\u6BB5\u5DF2\u9501\u5B9A\u804A\u5929\u8F93\u5165\uFF0C\u8BF7\u5148\u5B8C\u6210\u6D41\u7A0B\u3002";
      } else {
        chatLockHint.textContent = "";
      }
    }
    if (slayerFormatHint) {
      const showSlayerHint = isDiscussion && !state.paused;
      slayerFormatHint.style.display = showSlayerHint ? "" : "none";
      slayerFormatHint.textContent = showSlayerHint ? `\u730E\u624B\u58F0\u660E\u683C\u5F0F\uFF1A${SLAYER_DECLARATION_TEMPLATE}\uFF08\u4E0D\u7B26\u5408\u683C\u5F0F\u4E0D\u89E6\u53D1\uFF1B\u6BCF\u540D\u73A9\u5BB6\u6BCF\u5C40\u4EC5\u9996\u6B21\u6B64\u683C\u5F0F\u4F1A\u7ED3\u7B97\uFF09` : "";
    }
    if (slayerTemplateBtn) {
      slayerTemplateBtn.style.display = isDiscussion ? "" : "none";
      slayerTemplateBtn.disabled = !isDiscussion || state.paused;
    }
    sendBtn.disabled = !state.started || !allowPostGameChat && state.ended || chatBlocked;
    humanInput2.disabled = !state.started || !allowPostGameChat && state.ended || chatBlocked;
    if (humanInput2) {
      humanInput2.placeholder = isDiscussion ? `\u4F60\u53EF\u4EE5\u5728\u8FD9\u91CC\u53D1\u8A00...\uFF08\u730E\u624B\u683C\u5F0F\uFF1A${SLAYER_DECLARATION_TEMPLATE}\uFF09` : "\u4F60\u53EF\u4EE5\u5728\u8FD9\u91CC\u53D1\u8A00...";
    }
    const _canVoice = typeof _deps.canUseVoiceInput === "function" ? _deps.canUseVoiceInput() : false;
    if (voiceBtn2) voiceBtn2.disabled = !_canVoice;
    if (!_canVoice && speechActive) {
      stopVoiceRecognition("");
    }
    if (state.paused) {
      nightResolveBtn.disabled = true;
      aiTalkBtn.disabled = true;
      voteBtn.disabled = true;
      forceNominationBtn.disabled = true;
      sendBtn.disabled = true;
      passBtn.disabled = true;
      nominateBtn.disabled = true;
      skipNominationBtn.disabled = true;
      voteYesBtn.disabled = true;
      voteNoBtn.disabled = true;
      if (voiceBtn2) voiceBtn2.disabled = true;
      if (speechActive) {
        stopVoiceRecognition("\u6E38\u620F\u5DF2\u6682\u505C\u3002");
      }
      if (privateTargetSelect) privateTargetSelect.disabled = true;
      if (privateInput) privateInput.disabled = true;
      if (privateSendBtn) privateSendBtn.disabled = true;
      if (humanInput2) humanInput2.disabled = true;
    }
    const aliveCount = state.players.filter((p) => p.alive).length;
    const chips = [];
    if (state.started) {
      chips.push(`\u5B58\u6D3B ${aliveCount}/${state.players.length}`);
      if (state.phase === "day") {
        chips.push(`\u63D0\u540D ${state.dayNominationCount || 0}`);
      }
      if (state.evilChatPhase) {
        chips.push("\u90AA\u6076\u9635\u8425\u5BC6\u804A\u4E2D");
      }
      if (state.phase === "day" && state.dayStage === "discussion" && state.currentSpeakerId) {
        const speaker = state.players.find((p) => p.id === state.currentSpeakerId);
        if (speaker) chips.push(`\u5F53\u524D\u53D1\u8A00 ${speaker.isHuman ? "\u4F60" : speaker.name}`);
      }
      if (state.phase === "day" && state.dayStage === "nomination" && state.currentNomineeId) {
        const nominee = state.players.find((p) => p.id === state.currentNomineeId);
        if (nominee) chips.push(`\u88AB\u63D0\u540D ${nominee.name}`);
      }
      if (state.phase === "day" && state.dayStage === "nomination" && state.nominationPhase === "voting") {
        chips.push(`AI\u5F85\u6295 ${state.pendingAiVotes || 0}`);
      }
      if (state.paused) {
        chips.push("\u5DF2\u6682\u505C");
      }
    }
    renderStatusMeta(chips);
    renderTaskCardStatus();
    if (typeof _deps.updatePauseButton === "function") _deps.updatePauseButton();
  }
  function renderConfigSummary() {
    if (!configSummaryBox) return;
    const count = state && state.players ? state.players.length : Number(playerCountInput.value) || 0;
    const dist = PLAYER_DISTRIBUTION[count] || null;
    if (!count || !dist) {
      configSummaryBox.innerHTML = `<span class="chip">\u6682\u65E0\u914D\u7F6E</span>`;
      return;
    }
    const label = "\u6807\u51C6\u914D\u7F6E";
    const chips = [
      `<span class="chip">${label}</span>`,
      `<span class="chip">\u4EBA\u6570 ${count}</span>`,
      `<span class="chip">\u9547\u6C11 ${dist.townsfolk}</span>`,
      `<span class="chip">\u5916\u6765\u8005 ${dist.outsider}</span>`,
      `<span class="chip">\u722A\u7259 ${dist.minion}</span>`,
      `<span class="chip">\u6076\u9B54 ${dist.demon}</span>`
    ];
    configSummaryBox.innerHTML = chips.join("");
  }
  function renderTokenUsageDisplay() {
    const section = document.getElementById("tokenUsageSection");
    const container = document.getElementById("tokenUsageDisplay");
    if (!section || !container) return;
    const summary = getTokenUsageSummary();
    if (summary.totalTokens === 0) {
      section.style.display = "none";
      return;
    }
    section.style.display = "";
    const modelKeys = Object.keys(summary.models);
    const fmtNum = (n) => n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : String(n);
    const fmtCost = (c) => c < 0.01 ? "<$0.01" : "$" + c.toFixed(2);
    let rows = modelKeys.map((m) => {
      const u = summary.models[m];
      const costStr = u.hasPricing ? fmtCost(u.cost) : "\u2014";
      return `<tr><td title="${m}">${m.length > 28 ? m.slice(0, 26) + "\u2026" : m}</td><td>${u.calls}</td><td>${fmtNum(u.promptTokens)}</td><td>${fmtNum(u.completionTokens)}</td><td>${fmtNum(u.totalTokens)}</td><td>${costStr}</td></tr>`;
    }).join("");
    const hasAnyPricing = modelKeys.some((m) => summary.models[m].hasPricing);
    container.innerHTML = `<table class="token-usage-table"><tr><th>\u6A21\u578B</th><th>\u8C03\u7528</th><th>\u8F93\u5165</th><th>\u8F93\u51FA</th><th>\u603B\u8BA1</th><th>\u8D39\u7528</th></tr>${rows}</table><div class="token-usage-total"><span>\u603B Token: <b>${fmtNum(summary.totalTokens)}</b></span>` + (hasAnyPricing ? `<span>\u9884\u4F30\u603B\u82B1\u8D39: <span class="cost">${fmtCost(summary.totalCost)}</span></span>` : `<span style="color:var(--muted)">\u90E8\u5206\u6A21\u578B\u65E0\u5B9A\u4EF7\u6570\u636E</span>`) + `</div>`;
  }
  function renderSeatCircle2() {
    const wrapper = document.getElementById("seatCircle");
    const centerEl = document.getElementById("seatCircleCenter");
    const phaseIcon = document.getElementById("seatPhaseIcon");
    const phaseText = document.getElementById("seatPhaseText");
    if (!wrapper || !state || !state.players.length) return;
    if (phaseIcon && phaseText) {
      if (!state.started) {
        phaseIcon.textContent = "\u2694\uFE0F";
        phaseText.textContent = "\u672A\u5F00\u5C40";
      } else if (state.ended) {
        phaseIcon.textContent = "\u{1F480}";
        phaseText.textContent = "\u5DF2\u7ED3\u675F";
      } else if (state.phase === "night") {
        phaseIcon.textContent = "\u{1F319}";
        phaseText.textContent = `\u591C\u665A ${state.nightCount}`;
      } else if (state.phase === "day" && state.dayStage === "nomination") {
        phaseIcon.textContent = "\u{1F305}";
        phaseText.textContent = `\u767D\u5929 ${state.dayCount} \xB7 \u63D0\u540D (\u9EC4\u660F)`;
      } else {
        phaseIcon.textContent = "\u2600\uFE0F";
        phaseText.textContent = `\u767D\u5929 ${state.dayCount} \xB7 \u8BA8\u8BBA`;
      }
    }
    wrapper.querySelectorAll(".seat-node, .nomination-pointer-svg").forEach((n) => n.remove());
    const count = state.players.length;
    const wrapperRect = wrapper.getBoundingClientRect();
    const size = Math.min(wrapperRect.width, wrapperRect.height) || 400;
    const radius = size / 2 - 42;
    const cx = size / 2;
    const cy = size / 2;
    const isDay = state.started && !state.ended && state.phase === "day";
    const isNominationPhase = isDay && state.dayStage === "nomination";
    const nominatorId = isNominationPhase ? state.currentNominatorId : "";
    const nomineeId = isNominationPhase ? state.currentNomineeId : "";
    state.players.forEach((player, i) => {
      const angle = 2 * Math.PI * i / count - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      const node = document.createElement("div");
      let cls = "seat-node";
      cls += player.alive ? " alive" : " dead";
      if (player.isHuman) cls += " self";
      const isSpeaking = isDay && state.dayStage === "discussion" && state.currentSpeakerId === player.id;
      const isNominated = isNominationPhase && nomineeId === player.id;
      const isNominator = isNominationPhase && nominatorId === player.id;
      if (isSpeaking) cls += " speaking-node";
      if (isNominated) cls += " nominated-node";
      if (isNominator) cls += " nominator-node";
      node.className = cls;
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      let statusIcon = "";
      if (!player.alive) statusIcon = "\u{1F480}";
      else if (isSpeaking) statusIcon = "\u{1F5E3}\uFE0F";
      const noteRole = player.noteRole || "";
      const noteTags = Array.isArray(player.noteTags) ? player.noteTags : [];
      const toCenterAngle = angle + Math.PI;
      const plusDist = 34;
      const plusOffX = plusDist * Math.cos(toCenterAngle);
      const plusOffY = plusDist * Math.sin(toCenterAngle);
      const tagsDist = 54;
      const tagsOffX = tagsDist * Math.cos(toCenterAngle);
      const tagsOffY = tagsDist * Math.sin(toCenterAngle);
      const tagsHtml = noteTags.map(
        (t, ti) => `<span class="seat-tag" data-player-id="${player.id}" data-tag-idx="${ti}">${t}</span>`
      ).join("");
      node.innerHTML = `
      <span class="seat-num">${i + 1}</span>
      <span class="seat-note-role">${noteRole}</span>
      <span class="seat-label">${player.name}${player.isHuman ? " (\u4F60)" : ""}</span>
      ${statusIcon ? `<span class="seat-status-icon">${statusIcon}</span>` : ""}
      <span class="seat-tooltip">${player.name} \xB7 ${player.alive ? "\u5B58\u6D3B" : "\u6B7B\u4EA1"}${noteRole ? " \xB7 \u6807\u6CE8: " + noteRole : ""}</span>
      <span class="seat-plus-btn" data-player-id="${player.id}" style="left:${28 + plusOffX}px;top:${28 + plusOffY}px;transform:translate(-50%,-50%)">+</span>
      ${tagsHtml ? `<span class="seat-tags" style="left:${28 + tagsOffX}px;top:${28 + tagsOffY}px;transform:translate(-50%,-50%)">${tagsHtml}</span>` : ""}
    `;
      node.addEventListener("click", (e) => {
        if (e.target.closest(".seat-plus-btn") || e.target.closest(".seat-tag")) return;
        window.openNoteRolePicker(player.id, node.getBoundingClientRect());
      });
      wrapper.appendChild(node);
    });
    if (nominatorId && nomineeId) {
      const nominatorIdx = state.players.findIndex((p) => p.id === nominatorId);
      const nomineeIdx = state.players.findIndex((p) => p.id === nomineeId);
      if (nominatorIdx >= 0 && nomineeIdx >= 0) {
        let arrowPath = function(angle, len, color, inward) {
          const ex = cx + len * Math.cos(angle);
          const ey = cy + len * Math.sin(angle);
          var tipAngle = inward ? angle + Math.PI : angle;
          var tipDx = tipSize * Math.cos(tipAngle);
          var tipDy = tipSize * Math.sin(tipAngle);
          var perpX = tipSize * 0.5 * Math.cos(tipAngle + Math.PI / 2);
          var perpY = tipSize * 0.5 * Math.sin(tipAngle + Math.PI / 2);
          var tx = inward ? cx : ex;
          var ty = inward ? cy : ey;
          var t1x = tx + tipDx, t1y = ty + tipDy;
          var t2x = tx - perpX, t2y = ty - perpY;
          var t3x = tx + perpX, t3y = ty + perpY;
          return `<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="3" stroke-linecap="round"/><polygon points="${t1x},${t1y} ${t2x},${t2y} ${t3x},${t3y}" fill="${color}"/>`;
        };
        const ntrAngle = 2 * Math.PI * nominatorIdx / count - Math.PI / 2;
        const neeAngle = 2 * Math.PI * nomineeIdx / count - Math.PI / 2;
        const shortLen = radius * 0.58;
        const longLen = radius * 0.88;
        const tipSize = 10;
        const uid = Date.now();
        const svgHtml = `<svg class="nomination-pointer-svg" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-g-${uid}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b"/><feFlood flood-color="#daa520" flood-opacity="0.6"/>
            <feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-r-${uid}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4.5" result="b"/><feFlood flood-color="#dc3545" flood-opacity="0.6"/>
            <feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <g filter="url(#glow-g-${uid})">${arrowPath(ntrAngle, shortLen, "#daa520", true)}</g>
        <g filter="url(#glow-r-${uid})">${arrowPath(neeAngle, longLen, "#dc3545", false)}</g>
      </svg>`;
        const container = document.createElement("div");
        container.innerHTML = svgHtml;
        const svg = container.firstElementChild;
        wrapper.appendChild(svg);
      }
    }
  }
  var seatCircleObserver = null;
  function setupSeatCircleObserver() {
    const wrapper = document.getElementById("seatCircle");
    if (!wrapper || typeof ResizeObserver === "undefined") return;
    if (seatCircleObserver) seatCircleObserver.disconnect();
    seatCircleObserver = new ResizeObserver(() => {
      if (state && state.players && state.players.length) {
        renderSeatCircle2();
      }
    });
    seatCircleObserver.observe(wrapper);
  }
  function resetSeatCircleView() {
    const wrapper = document.getElementById("seatCircle");
    const phaseIcon = document.getElementById("seatPhaseIcon");
    const phaseText = document.getElementById("seatPhaseText");
    const nightOverlay = document.getElementById("nightOverlay");
    if (wrapper) {
      wrapper.querySelectorAll(".seat-node").forEach((n) => n.remove());
    }
    if (phaseIcon) phaseIcon.textContent = "\u2694\uFE0F";
    if (phaseText) phaseText.textContent = "\u672A\u5F00\u5C40";
    if (nightOverlay) nightOverlay.className = "night-overlay";
  }
  function renderAll() {
    if (!state || !state.players) {
      renderConfigSummary();
      renderTokenUsageDisplay();
      if (typeof _deps.updateHeaderPhase === "function") _deps.updateHeaderPhase();
      return;
    }
    renderPlayers();
    renderSeatCircle2();
    renderHumanInfo();
    renderHumanAction();
    if (typeof _deps.renderChat === "function") _deps.renderChat();
    if (typeof _deps.renderPrivateChat === "function") _deps.renderPrivateChat();
    renderLog();
    renderPublicLog();
    if (typeof _deps.renderReplay === "function") _deps.renderReplay();
    renderConfigSummary();
    renderTokenUsageDisplay();
    renderStatus();
    renderTaskCardStatus();
    if (typeof _deps.updatePrivateChatControls === "function") _deps.updatePrivateChatControls();
    if (typeof _deps.updateHeaderPhase === "function") _deps.updateHeaderPhase();
    saveState();
  }

  // js/tts.js
  var TTS_ENDPOINT = "https://api.xiaomimimo.com/v1/chat/completions";
  var TTS_MODEL = "mimo-v2-tts";
  var MAX_QUEUE = 6;
  var MAX_AUDIO_CACHE = 48;
  var VOICE_STYLES = [
    "\u6210\u719F\u7537\u6027 \u4F4E\u6C89\u78C1\u6027",
    "\u5E74\u8F7B\u5973\u6027 \u6E29\u67D4\u751C\u7F8E",
    "\u4E2D\u5E74\u7537\u6027 \u6C89\u7A33\u5A01\u4E25",
    "\u5C11\u5E74 \u6D3B\u6CFC\u5F00\u6717",
    "\u8001\u5E74\u7537\u6027 \u6C99\u54D1\u6CA7\u6851",
    "\u5E74\u8F7B\u7537\u6027 \u9633\u5149\u723D\u6717",
    "\u5C11\u5973 \u5143\u6C14\u53EF\u7231",
    "\u4E2D\u5E74\u5973\u6027 \u77E5\u6027\u4F18\u96C5",
    "\u9752\u5E74\u5973\u6027 \u82F1\u59FF\u98D2\u723D",
    "\u7537\u7AE5 \u5929\u771F\u7A1A\u5AE9",
    "\u4E1C\u5317\u53E3\u97F3 \u8C6A\u723D\u5927\u65B9",
    "\u56DB\u5DDD\u53E3\u97F3 \u6E29\u67D4\u4EB2\u5207",
    "\u5317\u4EAC\u53E3\u97F3 \u723D\u6717\u5927\u6C14",
    "\u5929\u6D25\u53E3\u97F3 \u5E7D\u9ED8\u98CE\u8DA3",
    "\u6CB3\u5357\u53E3\u97F3 \u6734\u5B9E\u61A8\u539A"
  ];
  var ttsToggle = document.getElementById("ttsToggle");
  var ttsAutoToggle = document.getElementById("ttsAutoToggle");
  var ttsPauseBtn = document.getElementById("ttsPauseBtn");
  var ttsQuickPauseBtn = document.getElementById("ttsQuickPauseBtn");
  var ttsQuickClearBtn = document.getElementById("ttsQuickClearBtn");
  var ttsVolumeSlider = document.getElementById("ttsVolumeSlider");
  var ttsStatusEl = document.getElementById("ttsStatus");
  var ttsQuickStatusEl = document.getElementById("ttsQuickStatus");
  var bgmAudio = document.getElementById("bgmAudio");
  var TTS_STORAGE_KEY = "tts_settings";
  function loadTtsSettings() {
    try {
      return JSON.parse(localStorage.getItem(TTS_STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }
  function saveTtsSettings() {
    localStorage.setItem(TTS_STORAGE_KEY, JSON.stringify({
      enabled: Boolean(ttsToggle?.checked),
      autoPlay: ttsAutoToggle ? ttsAutoToggle.checked !== false : true,
      volume: parseFloat(ttsVolumeSlider?.value) || 0.8
    }));
  }
  var saved = loadTtsSettings();
  if (ttsToggle) ttsToggle.checked = Boolean(saved.enabled);
  if (ttsAutoToggle) ttsAutoToggle.checked = saved.autoPlay !== false;
  if (ttsVolumeSlider && saved.volume !== void 0) ttsVolumeSlider.value = saved.volume;
  function getMimoApiKey() {
    return catalogApiKeys.mimo || "";
  }
  function isTtsEnabled() {
    return Boolean(ttsToggle?.checked);
  }
  function shouldAutoSpeak() {
    return isTtsEnabled() && (ttsAutoToggle ? ttsAutoToggle.checked !== false : true);
  }
  var speakerStyleMap = {};
  var usedStyleIndices = [];
  function getStyleForSpeaker(name) {
    if (speakerStyleMap[name]) return speakerStyleMap[name];
    if (usedStyleIndices.length >= VOICE_STYLES.length) {
      usedStyleIndices = [];
    }
    const available = VOICE_STYLES.map((_, index) => index).filter((index) => !usedStyleIndices.includes(index));
    const pick = available[Math.floor(Math.random() * available.length)];
    usedStyleIndices.push(pick);
    speakerStyleMap[name] = VOICE_STYLES[pick];
    return speakerStyleMap[name];
  }
  var queue = [];
  var audioCache = /* @__PURE__ */ new Map();
  var playing = false;
  var paused = false;
  var bgmLowered = false;
  var cancelled = false;
  var currentAudio = null;
  var currentEntry = null;
  var resumeWaiters = [];
  function getSpeechCacheKey(speaker, text) {
    return `${speaker}\0${String(text || "").trim()}`;
  }
  function trimAudioCache() {
    while (audioCache.size > MAX_AUDIO_CACHE) {
      const oldestKey = audioCache.keys().next().value;
      if (!oldestKey) break;
      audioCache.delete(oldestKey);
    }
  }
  function getCachedAudioPromise(speaker, text) {
    const key = getSpeechCacheKey(speaker, text);
    if (audioCache.has(key)) {
      const cachedPromise = audioCache.get(key);
      audioCache.delete(key);
      audioCache.set(key, cachedPromise);
      return { key, promise: cachedPromise, cached: true };
    }
    const promise = fetchTtsAudioBlob(speaker, text).catch((error) => {
      audioCache.delete(key);
      throw error;
    });
    audioCache.set(key, promise);
    trimAudioCache();
    return { key, promise, cached: false };
  }
  function ttsPrefetch(speaker, text) {
    const cleanedText = String(text || "").trim();
    if (!cleanedText || !isTtsEnabled()) return false;
    getCachedAudioPromise(speaker, cleanedText);
    return true;
  }
  function lowerBgm() {
    if (bgmLowered || !bgmAudio) return;
    bgmLowered = true;
    bgmAudio._savedVolume = bgmAudio.volume;
    bgmAudio.volume = Math.max(0, bgmAudio.volume * 0.25);
  }
  function restoreBgm() {
    if (!bgmLowered || !bgmAudio) return;
    bgmLowered = false;
    if (bgmAudio._savedVolume !== void 0) {
      bgmAudio.volume = bgmAudio._savedVolume;
      delete bgmAudio._savedVolume;
    }
  }
  function getIdleStatusText() {
    return isTtsEnabled() ? "\u8BED\u97F3\u5F85\u547D" : "\u8BED\u97F3\u672A\u542F\u7528";
  }
  function updateStatus(message = "", cls = "") {
    const finalMessage = message || getIdleStatusText();
    if (ttsStatusEl) {
      ttsStatusEl.textContent = finalMessage;
      ttsStatusEl.className = "tts-status" + (cls ? ` ${cls}` : "");
    }
    if (ttsQuickStatusEl) {
      ttsQuickStatusEl.textContent = finalMessage;
    }
  }
  function describeEntry(entry) {
    if (!entry) return "";
    const remaining = Math.max(0, queue.length);
    return `${entry.speaker} \u8BED\u97F3${remaining ? `\uFF08\u5269\u4F59 ${remaining}\uFF09` : ""}`;
  }
  function updatePauseButton() {
    const hasWork = Boolean(currentEntry || currentAudio || queue.length);
    [ttsPauseBtn, ttsQuickPauseBtn].forEach((button) => {
      if (!button) return;
      button.disabled = !hasWork;
      button.textContent = paused ? "\u7EE7\u7EED\u64AD\u653E" : "\u6682\u505C\u64AD\u653E";
    });
    if (ttsQuickClearBtn) {
      ttsQuickClearBtn.disabled = !hasWork;
    }
  }
  function refreshStatus() {
    if (paused && (currentEntry || currentAudio || queue.length)) {
      updateStatus(`\u8BED\u97F3\u5DF2\u6682\u505C\uFF1A${describeEntry(currentEntry) || "\u7B49\u5F85\u7EE7\u7EED"}`, "paused");
      updatePauseButton();
      return;
    }
    if (playing && currentEntry) {
      if (currentEntry.phase === "loading") {
        updateStatus(`\u6B63\u5728\u8BF7\u6C42\uFF1A${describeEntry(currentEntry)}`, "active");
      } else {
        updateStatus(`\u{1F50A} \u6B63\u5728\u64AD\u653E\uFF1A${describeEntry(currentEntry)}`, "active");
      }
      updatePauseButton();
      return;
    }
    if (queue.length) {
      const next = queue[0];
      const prefix = next.cached ? "\u5DF2\u6392\u961F" : "\u7B49\u5F85\u8BF7\u6C42";
      updateStatus(`${prefix}\uFF1A${describeEntry(next)}`, "active");
      updatePauseButton();
      return;
    }
    updateStatus("");
    updatePauseButton();
  }
  function resolveResumeWaiters() {
    const pending = resumeWaiters.slice();
    resumeWaiters = [];
    pending.forEach((resolve) => resolve());
  }
  function waitUntilResumed() {
    if (!paused) return Promise.resolve();
    return new Promise((resolve) => {
      resumeWaiters.push(resolve);
    });
  }
  async function fetchTtsAudioBlob(speaker, text) {
    const apiKey = getMimoApiKey();
    if (!apiKey || apiKey === "YOUR_MIMO_API_KEY") {
      throw new Error("\u8BF7\u5728 model_catalog.yaml \u4E2D\u586B\u5199 mimo API Key");
    }
    const style = getStyleForSpeaker(speaker);
    const styledText = `<style>${style}</style>${text}`;
    const body = {
      model: TTS_MODEL,
      messages: [
        {
          role: "user",
          content: `\u8BF7\u7528\u81EA\u7136\u6D41\u7545\u7684\u8BED\u6C14\u6717\u8BFB\u4EE5\u4E0B\u5185\u5BB9\u3002\u4F60\u662F\u4E00\u4E2A\u540D\u53EB"${speaker}"\u7684\u89D2\u8272\u3002`
        },
        {
          role: "assistant",
          content: styledText
        }
      ],
      audio: {
        format: "wav",
        voice: "mimo_default"
      }
    };
    const response = await fetch(TTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`API ${response.status}: ${errorText.slice(0, 200)}`);
    }
    const data = await response.json();
    const audioB64 = data?.choices?.[0]?.message?.audio?.data;
    if (!audioB64) {
      throw new Error("API \u8FD4\u56DE\u4E2D\u65E0\u97F3\u9891\u6570\u636E");
    }
    const raw = atob(audioB64);
    const bytes = new Uint8Array(raw.length);
    for (let index = 0; index < raw.length; index += 1) {
      bytes[index] = raw.charCodeAt(index);
    }
    return new Blob([bytes], { type: "audio/wav" });
  }
  function playAudioBlob(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const audio2 = new Audio(url);
      currentAudio = audio2;
      audio2.volume = parseFloat(ttsVolumeSlider?.value) || 0.8;
      audio2.onended = () => {
        currentAudio = null;
        URL.revokeObjectURL(url);
        resolve();
      };
      audio2.onerror = (event) => {
        currentAudio = null;
        URL.revokeObjectURL(url);
        reject(event);
      };
      audio2.play().catch((error) => {
        currentAudio = null;
        URL.revokeObjectURL(url);
        reject(error);
      });
    });
  }
  function dropOverflowQueue() {
    while (queue.length > MAX_QUEUE) {
      queue.shift();
    }
  }
  function enqueueSpeech(speaker, text, options = {}) {
    const { promise, cached } = getCachedAudioPromise(speaker, text);
    const entry = {
      speaker,
      text,
      cached,
      audioPromise: promise,
      phase: "loading"
    };
    if (options.priority) {
      queue.unshift(entry);
    } else {
      queue.push(entry);
    }
    dropOverflowQueue();
    if (options.manual) {
      updateStatus(
        cached ? `\u5DF2\u52A0\u5165\u64AD\u653E\u961F\u5217\uFF1A${speaker} \u8BED\u97F3` : `\u6B63\u5728\u8BF7\u6C42\uFF1A${speaker} \u8BED\u97F3`,
        "active"
      );
    }
    refreshStatus();
    processQueue();
    return { queued: true, cached };
  }
  async function processQueue() {
    if (playing || !queue.length) return;
    playing = true;
    cancelled = false;
    while (queue.length > 0 && !cancelled) {
      const entry = queue.shift();
      currentEntry = entry;
      currentEntry.phase = "loading";
      refreshStatus();
      try {
        const blob = await entry.audioPromise;
        if (cancelled) {
          break;
        }
        if (paused) {
          refreshStatus();
          await waitUntilResumed();
          if (cancelled) {
            break;
          }
        }
        currentEntry.phase = "playing";
        refreshStatus();
        lowerBgm();
        await playAudioBlob(blob);
      } catch (error) {
        console.warn("[TTS] error:", error);
        updateStatus(`\u8BED\u97F3\u64AD\u62A5\u5931\u8D25: ${error?.message || error}`, "error");
      } finally {
        currentEntry = null;
        refreshStatus();
      }
    }
    playing = false;
    currentAudio = null;
    currentEntry = null;
    restoreBgm();
    if (!cancelled) {
      refreshStatus();
    }
  }
  function setPaused(nextPaused) {
    if (paused === nextPaused) return paused;
    paused = nextPaused;
    if (paused) {
      if (currentAudio && !currentAudio.paused) {
        try {
          currentAudio.pause();
        } catch {
        }
      }
      restoreBgm();
      refreshStatus();
      return paused;
    }
    resolveResumeWaiters();
    if (currentAudio && currentAudio.paused) {
      lowerBgm();
      currentAudio.play().catch((error) => {
        console.warn("[TTS] resume failed:", error);
        updateStatus(`\u7EE7\u7EED\u64AD\u653E\u5931\u8D25: ${error?.message || error}`, "error");
      });
    } else if (!playing && queue.length) {
      processQueue();
    }
    refreshStatus();
    return paused;
  }
  function ttsSpeak(speaker, text, options = {}) {
    const cleanedText = String(text || "").trim();
    if (!cleanedText) return { accepted: false, cached: false };
    if (!isTtsEnabled()) {
      if (options.manual) {
        updateStatus("\u8BF7\u5148\u5F00\u542F AI \u8BED\u97F3\u529F\u80FD\u3002", "error");
      }
      return { accepted: false, cached: false };
    }
    if (!options.manual && !shouldAutoSpeak()) {
      return { accepted: false, cached: false };
    }
    cancelled = false;
    const queued = enqueueSpeech(speaker, cleanedText, {
      priority: Boolean(options.priority),
      manual: Boolean(options.manual)
    });
    return { accepted: true, cached: Boolean(queued.cached) };
  }
  function ttsPlayManual(speaker, text) {
    return ttsSpeak(speaker, text, { manual: true, priority: true });
  }
  function ttsTogglePause(forcePaused = null) {
    const nextPaused = typeof forcePaused === "boolean" ? forcePaused : !paused;
    return setPaused(nextPaused);
  }
  function ttsClearQueue() {
    cancelled = true;
    resolveResumeWaiters();
    queue.length = 0;
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch {
      }
      currentAudio = null;
    }
    currentEntry = null;
    playing = false;
    paused = false;
    restoreBgm();
    refreshStatus();
  }
  function ttsShouldAutoSpeak() {
    return shouldAutoSpeak();
  }
  if (ttsToggle) {
    ttsToggle.addEventListener("change", () => {
      if (!ttsToggle.checked) {
        ttsClearQueue();
      }
      saveTtsSettings();
      refreshStatus();
    });
  }
  if (ttsAutoToggle) {
    ttsAutoToggle.addEventListener("change", () => {
      saveTtsSettings();
      refreshStatus();
    });
  }
  if (ttsVolumeSlider) {
    ttsVolumeSlider.addEventListener("input", () => {
      if (currentAudio) {
        currentAudio.volume = parseFloat(ttsVolumeSlider.value) || 0.8;
      }
      saveTtsSettings();
    });
  }
  [ttsPauseBtn, ttsQuickPauseBtn].forEach((button) => {
    if (!button) return;
    button.addEventListener("click", () => {
      ttsTogglePause();
    });
  });
  if (ttsQuickClearBtn) {
    ttsQuickClearBtn.addEventListener("click", () => {
      ttsClearQueue();
    });
  }
  refreshStatus();
  window.ttsSpeak = ttsSpeak;
  window.ttsPrefetch = ttsPrefetch;
  window.ttsPlayManual = ttsPlayManual;
  window.ttsClearQueue = ttsClearQueue;
  window.ttsTogglePause = ttsTogglePause;
  window.ttsShouldAutoSpeak = ttsShouldAutoSpeak;

  // js/chat.js
  var _getPhaseLabel = () => "\u672A\u5F00\u5C40";
  var _renderLog = () => {
  };
  var _renderPublicLog = () => {
  };
  var _maybeHandleSlayerClaim = () => {
  };
  function setChatDeps({ getPhaseLabel: getPhaseLabel2, renderLog: renderLog2, renderPublicLog: renderPublicLog2, maybeHandleSlayerClaim: maybeHandleSlayerClaim2 }) {
    if (typeof getPhaseLabel2 === "function") _getPhaseLabel = getPhaseLabel2;
    if (typeof renderLog2 === "function") _renderLog = renderLog2;
    if (typeof renderPublicLog2 === "function") _renderPublicLog = renderPublicLog2;
    if (typeof maybeHandleSlayerClaim2 === "function") _maybeHandleSlayerClaim = maybeHandleSlayerClaim2;
  }
  function isPublicChatTabActive() {
    return Boolean(chatTabPublicContent && chatTabPublicContent.classList.contains("active"));
  }
  function isChatNearBottom(threshold = CHAT_NEAR_BOTTOM_THRESHOLD) {
    if (!chatBox) return true;
    const distance = chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight;
    return distance <= threshold;
  }
  function scrollChatToLatest() {
    if (!chatBox) return;
    chatBox.style.scrollBehavior = "auto";
    chatBox.scrollTop = Math.max(0, chatBox.scrollHeight - chatBox.clientHeight);
  }
  function lockChatToBottom(ms = 260) {
    if (!chatBox || !state) return;
    if (chatPinLockTimer) clearTimeout(chatPinLockTimer);
    const startAt = Date.now();
    const minDuration = Math.max(100, ms);
    const hardEndAt = Date.now() + Math.max(260, ms + 260);
    let stableFrames = 0;
    let lastHeight = -1;
    const tick = () => {
      if (!state || state.chatAutoFollow === false || !isPublicChatTabActive()) return;
      scrollChatToLatest();
      const currentHeight = chatBox.scrollHeight;
      if (currentHeight === lastHeight) {
        stableFrames += 1;
      } else {
        stableFrames = 0;
        lastHeight = currentHeight;
      }
      const now = Date.now();
      const shouldContinue = now < startAt + minDuration || stableFrames < 2 && now < hardEndAt;
      if (shouldContinue) {
        requestAnimationFrame(tick);
      }
    };
    tick();
    setChatPinLockTimer(setTimeout(() => {
      setChatPinLockTimer(null);
    }, Math.max(140, ms + 80)));
  }
  function scheduleChatRelock(ms = 260) {
    if (!chatBox || !state || state.chatAutoFollow === false || !isPublicChatTabActive()) return;
    if (chatRelockRaf) cancelAnimationFrame(chatRelockRaf);
    if (chatRelockTimer) clearTimeout(chatRelockTimer);
    setChatRelockRaf(requestAnimationFrame(() => {
      setChatRelockRaf(null);
      lockChatToBottom(ms);
    }));
    setChatRelockTimer(setTimeout(() => {
      setChatRelockTimer(null);
      lockChatToBottom(Math.max(200, ms));
    }, 56));
  }
  function setupChatLayoutObserver() {
    if (typeof ResizeObserver === "undefined") return;
    if (chatLayoutObserver) chatLayoutObserver.disconnect();
    const targets = [
      chatBox,
      chatTabPublicContent,
      discussionActionsEl,
      discussionLogDrawer,
      townRightScrollEl,
      townRightEl
    ].filter(Boolean);
    if (!targets.length) return;
    let queued = false;
    setChatLayoutObserver(new ResizeObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scheduleChatRelock(320);
      });
    }));
    targets.forEach((el) => chatLayoutObserver.observe(el));
  }
  function isDiscussionFocusMode() {
    return Boolean(
      state && state.started && !state.ended && state.phase === "day" && state.dayStage === "discussion"
    );
  }
  function applyDiscussionDrawers() {
    if (!state || !townLayoutEl) return;
    const active = isDiscussionFocusMode();
    if (!active) {
      state.discussionTownDrawerOpen = false;
      state.discussionLogDrawerOpen = false;
    }
    const townOpen = active && state.discussionTownDrawerOpen === true;
    const logOpen = active && state.discussionLogDrawerOpen === true;
    townLayoutEl.classList.toggle("show-town-left", townOpen);
    townLayoutEl.classList.toggle("show-public-log", logOpen);
    townLayoutEl.classList.toggle("overlay-open", townOpen || logOpen);
    if (peekTownBtn) peekTownBtn.textContent = townOpen ? "\u6536\u8D77\u5E7F\u573A" : "\u5E7F\u573A";
    if (peekLogBtn) peekLogBtn.textContent = logOpen ? "\u6536\u8D77\u8BB0\u5F55" : "\u8BB0\u5F55";
  }
  function setDiscussionDrawer(kind, forceOpen = null) {
    if (!state || !townLayoutEl || !isDiscussionFocusMode()) return;
    const townKey = "discussionTownDrawerOpen";
    const logKey = "discussionLogDrawerOpen";
    const openTown = kind === "town";
    const key = openTown ? townKey : logKey;
    const otherKey = openTown ? logKey : townKey;
    const next = typeof forceOpen === "boolean" ? forceOpen : !(state[key] === true);
    state[key] = next;
    if (next) {
      state[otherKey] = false;
    }
    applyDiscussionDrawers();
    scheduleChatRelock(340);
    saveState();
  }
  function closeDiscussionDrawers() {
    if (!state || !townLayoutEl) return;
    state.discussionTownDrawerOpen = false;
    state.discussionLogDrawerOpen = false;
    applyDiscussionDrawers();
    scheduleChatRelock(260);
    saveState();
  }
  function getLatestChatSeq() {
    return Number(state?.chatSeq) || 0;
  }
  function syncUnreadChatCount() {
    if (!state) return;
    const latestSeq = getLatestChatSeq();
    const lastRead = Number(state.chatLastReadSeq) || 0;
    state.chatUnreadCount = Math.max(0, latestSeq - lastRead);
  }
  function markChatReadToLatest() {
    if (!state) return;
    state.chatLastReadSeq = getLatestChatSeq();
    state.chatUnreadCount = 0;
  }
  function updateChatToolbarStatus(filteredCount = null) {
    if (!state) return;
    if (chatAutoScrollBtn) {
      chatAutoScrollBtn.textContent = `\u8DDF\u968F\u65B0\u6D88\u606F\uFF1A${state.chatAutoFollow === false ? "\u5173" : "\u5F00"}`;
    }
    if (chatJumpLatestBtn) {
      const unread = Number(state.chatUnreadCount) || 0;
      const show = unread > 0;
      chatJumpLatestBtn.classList.toggle("visible", show);
      chatJumpLatestBtn.textContent = show ? `\u56DE\u5230\u5E95\u90E8\uFF08${unread}\uFF09` : "\u56DE\u5230\u5E95\u90E8";
    }
    if (chatResultHint) {
      const total = Array.isArray(state.chat) ? state.chat.length : 0;
      const shown = typeof filteredCount === "number" ? filteredCount : total;
      const filter = state.chatFilter || "all";
      const keyword = (state.chatSearch || "").trim();
      const segments = [];
      if (filter !== "all") segments.push(`\u73A9\u5BB6\uFF1A${filter}`);
      if (keyword) segments.push(`\u5173\u952E\u8BCD\uFF1A${keyword}`);
      const queryText = segments.length ? `\uFF08${segments.join("\uFF0C")}\uFF09` : "";
      chatResultHint.textContent = `\u663E\u793A ${shown}/${total} \u6761${queryText}`;
    }
  }
  function addLogEntry(text, type = "note", data = {}) {
    const time = (/* @__PURE__ */ new Date()).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    state.log.unshift({
      time,
      phase: _getPhaseLabel(),
      type,
      text,
      data
    });
    _renderLog();
    saveState();
  }
  function addPublicLogEntry(text) {
    if (!state) return;
    const time = (/* @__PURE__ */ new Date()).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    if (!Array.isArray(state.publicLog)) state.publicLog = [];
    state.publicLog.push({
      time,
      phase: _getPhaseLabel(),
      text
    });
    _renderPublicLog();
    saveState();
  }
  function addReplayEvent(text, type = "note") {
    if (!state) return;
    state.replayEvents.push({
      time: (/* @__PURE__ */ new Date()).toISOString(),
      phase: _getPhaseLabel(),
      type,
      text
    });
    saveState();
  }
  function addChat(speaker, text, type = "player") {
    if (state && state.dayStage === "nomination" && type === "player" && !["reason", "defense"].includes(state.nominationPhase) && !state.postGameChat) {
      return;
    }
    const nextSeq = (Number(state.chatSeq) || 0) + 1;
    state.chatSeq = nextSeq;
    state.chat.push({
      time: (/* @__PURE__ */ new Date()).toISOString(),
      phase: _getPhaseLabel(),
      speaker,
      type,
      text,
      seq: nextSeq
    });
    const shouldAutoFollow = state.chatAutoFollow !== false && isPublicChatTabActive();
    if (shouldAutoFollow) {
      markChatReadToLatest();
    } else {
      syncUnreadChatCount();
    }
    renderChat({ forceScroll: shouldAutoFollow });
    if (type === "player") {
      _maybeHandleSlayerClaim(speaker, text);
      updateClaimsFromChat(speaker, text);
      const speakerPlayer = state.players.find((p) => p.name === speaker);
      if (speakerPlayer && !speakerPlayer.isHuman) {
        if (!ttsShouldAutoSpeak()) {
          ttsPrefetch(speaker, text);
        }
        ttsSpeak(speaker, text);
      }
    }
    saveState();
  }
  function canPlayTtsForSpeaker(speaker) {
    if (!state || !speaker) return false;
    const speakerPlayer = state.players.find((p) => p.name === speaker);
    return Boolean(speakerPlayer && !speakerPlayer.isHuman);
  }
  function buildChatTextNode(text) {
    const voteResultNode = buildVoteResultNode(text);
    if (voteResultNode) {
      return voteResultNode;
    }
    const body = document.createElement("div");
    body.className = "chat-item-body";
    body.textContent = text;
    return body;
  }
  function buildVoteResultNode(text) {
    const content = String(text || "").trim();
    const match = content.match(
      /^<div class="vote-result-bar"><span>([^<]+)<\/span><div class="vote-bar-track"><div class="vote-bar-fill" style="width:(\d+)%"><\/div><\/div><span class="vote-bar-label">(\d+)\/(\d+) \((\d+)%\)<\/span><\/div>$/
    );
    if (!match) return null;
    const [, nomineeName, widthPct, yesVotes, aliveCount, labelPct] = match;
    const wrapper = document.createElement("div");
    wrapper.className = "vote-result-bar";
    const nameSpan = document.createElement("span");
    nameSpan.textContent = nomineeName;
    wrapper.appendChild(nameSpan);
    const track = document.createElement("div");
    track.className = "vote-bar-track";
    const fill = document.createElement("div");
    fill.className = "vote-bar-fill";
    fill.style.width = `${Number(widthPct) || 0}%`;
    track.appendChild(fill);
    wrapper.appendChild(track);
    const label = document.createElement("span");
    label.className = "vote-bar-label";
    label.textContent = `${yesVotes}/${aliveCount} (${labelPct}%)`;
    wrapper.appendChild(label);
    return wrapper;
  }
  function buildChatHeader(metaText, speaker = "", text = "") {
    const header = document.createElement("div");
    header.className = "chat-item-header";
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = metaText;
    header.appendChild(meta);
    if (canPlayTtsForSpeaker(speaker)) {
      const playBtn = document.createElement("button");
      playBtn.type = "button";
      playBtn.className = "secondary chat-item-tts-btn";
      playBtn.textContent = "\u64AD\u653E";
      playBtn.title = `\u64AD\u653E ${speaker} \u7684\u8FD9\u6761\u53D1\u8A00`;
      playBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const result = ttsPlayManual(speaker, text);
        if (!result || !result.accepted) {
          playBtn.textContent = "\u4E0D\u53EF\u7528";
        } else {
          playBtn.textContent = result.cached ? "\u5DF2\u6392\u961F" : "\u52A0\u8F7D\u4E2D";
        }
        playBtn.disabled = true;
        playBtn.classList.add("loading");
        window.setTimeout(() => {
          if (!playBtn.isConnected) return;
          playBtn.textContent = "\u64AD\u653E";
          playBtn.disabled = false;
          playBtn.classList.remove("loading");
        }, result && result.cached ? 1e3 : 1600);
      });
      header.appendChild(playBtn);
    }
    return header;
  }
  function appendRenderedChatItem(container, metaText, text, className, speaker = "") {
    const div = document.createElement("div");
    div.className = className;
    div.appendChild(buildChatHeader(metaText, speaker, text));
    div.appendChild(buildChatTextNode(text));
    container.appendChild(div);
  }
  function addPrivateChat(sender, target, text) {
    if (!state) return;
    const senderPlayer = state.players.find((p) => p.name === sender);
    const targetPlayer = state.players.find((p) => p.name === target);
    state.privateChat.push({
      time: (/* @__PURE__ */ new Date()).toISOString(),
      phase: _getPhaseLabel(),
      sender,
      target,
      senderId: senderPlayer ? senderPlayer.id : "",
      targetId: targetPlayer ? targetPlayer.id : "",
      text
    });
    renderPrivateChat();
    saveState();
  }
  function addEvilChat(sender, text) {
    if (!state) return;
    const senderPlayer = state.players.find((p) => p.name === sender);
    state.evilChat.push({
      time: (/* @__PURE__ */ new Date()).toISOString(),
      phase: _getPhaseLabel(),
      sender,
      senderId: senderPlayer ? senderPlayer.id : "",
      text
    });
    saveState();
  }
  function formatEvilChatForPrompt(actor) {
    if (!actor) return "";
    if (actor.team !== "minion" && actor.team !== "demon") return "";
    const all = state.evilChat || [];
    if (!all.length) return "";
    return all.map((c) => `[\u90AA\u6076\u5BC6\u804A] ${c.sender}: ${c.text}`).join("\n");
  }
  function extractRoleClaim(text) {
    if (!text) return "";
    const content = String(text);
    for (const roleName of ROLE_NAME_LIST) {
      const denyPattern = new RegExp(`\u4E0D\u662F\\s*${roleName}`);
      if (denyPattern.test(content)) continue;
      const claimPattern = new RegExp(
        `(\u6211\u662F|\u6211\u5C31\u662F|\u6211\u81EA\u79F0|\u6211\u8DF3|\u6211\u62A5|\u6211\u58F0\u79F0\u81EA\u5DF1\u662F|\u6211\u5BA3\u79F0\u81EA\u5DF1\u662F|\u6211\u79F0\u81EA\u5DF1\u662F)\\s*${roleName}`
      );
      if (claimPattern.test(content)) {
        return roleName;
      }
    }
    return "";
  }
  function updateClaimsFromChat(speaker, text) {
    if (!state || !speaker || !text) return;
    const player = state.players.find((p) => p.name === speaker);
    if (!player) return;
    const roleName = extractRoleClaim(text);
    if (!roleName) return;
    if (!state.claims || typeof state.claims !== "object") {
      state.claims = {};
    }
    if (!Array.isArray(state.claimHistory)) {
      state.claimHistory = [];
    }
    const entry = {
      playerId: player.id,
      playerName: player.name,
      roleName,
      time: (/* @__PURE__ */ new Date()).toISOString(),
      phase: _getPhaseLabel(),
      night: state.nightCount,
      day: state.dayCount,
      text: String(text).slice(0, 200)
    };
    state.claims[player.id] = entry;
    state.claimHistory.push(entry);
  }
  function renderChat(options = {}) {
    const forceScroll = Boolean(options.forceScroll);
    chatBox.innerHTML = "";
    if (chatSearchInput && chatSearchInput.value !== (state.chatSearch || "")) {
      chatSearchInput.value = state.chatSearch || "";
    }
    const human = state.players.find((p) => p.isHuman);
    const filter = state.chatFilter || "all";
    const searchRaw = typeof state.chatSearch === "string" ? state.chatSearch : "";
    const search = searchRaw.trim().toLowerCase();
    const items = Array.isArray(state.chat) ? state.chat.slice() : [];
    const filtered = items.filter((item) => {
      if (filter !== "all" && item.speaker !== filter) return false;
      if (!search) return true;
      const haystack = `${item.phase} ${item.speaker} ${item.text}`.toLowerCase();
      return haystack.includes(search);
    });
    if (!filtered.length) {
      const label = search ? `\u6CA1\u6709\u5339\u914D"${searchRaw.trim()}"\u7684\u53D1\u8A00\u3002` : filter === "all" ? "\u6682\u65E0\u53D1\u8A00\u3002" : `\u6682\u65E0 ${filter} \u7684\u53D1\u8A00\u3002`;
      appendRenderedChatItem(chatBox, "\u63D0\u793A", label, "chat-item system");
      updateChatToolbarStatus(0);
      return;
    }
    filtered.forEach((item) => {
      const isSelf = human && item.speaker === human.name && item.type === "player";
      const className = `chat-item ${item.type}${isSelf ? " self-msg" : ""}${search ? " search-hit" : ""}`;
      appendRenderedChatItem(chatBox, `${item.phase} \xB7 ${item.speaker}`, item.text, className, item.speaker);
    });
    const shouldStickBottom = forceScroll || state.chatAutoFollow !== false && isPublicChatTabActive();
    if (shouldStickBottom) {
      lockChatToBottom(320);
      markChatReadToLatest();
    } else {
      syncUnreadChatCount();
    }
    updateChatToolbarStatus(filtered.length);
  }
  function renderPrivateChat() {
    if (!privateChatBox) return;
    privateChatBox.innerHTML = "";
    const items = state.privateChat || [];
    const human = state.players.find((p) => p.isHuman);
    const visibleItems = human ? items.filter((item) => item.senderId === human.id || item.targetId === human.id) : items;
    if (!visibleItems.length) {
      const hasOtherChats = items.length > 0;
      const hint = hasOtherChats ? "\u6682\u65E0\u4E0E\u4F60\u76F8\u5173\u7684\u79C1\u804A\u3002" : "\u9996\u4E2A\u767D\u5929\u53EF\u8FDB\u884C\u79C1\u804A\u3002";
      appendRenderedChatItem(privateChatBox, "\u6682\u65E0\u79C1\u804A", hint, "chat-item system");
      return;
    }
    visibleItems.slice(-80).forEach((item) => {
      appendRenderedChatItem(
        privateChatBox,
        `${item.phase} \xB7 ${item.sender} -> ${item.target}`,
        item.text,
        "chat-item",
        item.sender
      );
    });
    privateChatBox.scrollTop = privateChatBox.scrollHeight;
  }
  function isPrivateChatOpen() {
    if (!state || !state.started || state.ended) return false;
    if (state.phase !== "day") return false;
    if (state.dayCount !== 1) return false;
    if (state.dayStage === "nomination") return false;
    if (state.evilChatPhase) {
      const human = state.players.find((p) => p.isHuman);
      if (!human || human.team !== "minion" && human.team !== "demon") return false;
    }
    return true;
  }
  function canUseVoiceInput2() {
    if (!state || !state.started || state.paused) return false;
    if (state.ended) {
      return Boolean(state.postGameChat);
    }
    if (state.phase !== "day") return false;
    if (state.evilChatPhase) {
      const human = state.players.find((p) => p.isHuman);
      if (!human || human.team !== "minion" && human.team !== "demon") return false;
    }
    return state.dayStage === "discussion";
  }
  function updatePrivateChatControls() {
    if (!privateTargetSelect || !privateInput || !privateSendBtn || !privateChatHint) return;
    const open = isPrivateChatOpen();
    privateTargetSelect.disabled = !open;
    privateInput.disabled = !open;
    privateSendBtn.disabled = !open;
    if (state && state.evilChatPhase) {
      const human = state.players.find((p) => p.isHuman);
      const humanIsGood = human && human.team !== "minion" && human.team !== "demon";
      privateChatHint.textContent = humanIsGood ? "\u90AA\u6076\u9635\u8425\u5BC6\u804A\u4E2D\uFF0C\u5584\u826F\u73A9\u5BB6\u65E0\u6CD5\u4F7F\u7528\u79C1\u804A\u3002" : "\u4EC5\u767D\u59291\u53EF\u4F7F\u7528\u79C1\u804A\u3002";
    } else {
      privateChatHint.textContent = open ? "\u4EC5\u767D\u59291\u53EF\u4F7F\u7528\u79C1\u804A\u3002" : "\u79C1\u804A\u4EC5\u5728\u767D\u59291\u5F00\u653E\u3002";
    }
  }
  function formatPlayerPrivateChats(actor) {
    if (!state || !actor) return "\u65E0";
    if (state.dayCount > 1 || state.phase === "night" && state.nightCount > 1) return "\u65E0";
    var all = (state.privateChat || []).filter(
      function(item) {
        return item.senderId === actor.id || item.targetId === actor.id;
      }
    );
    if (!all.length) return "\u65E0";
    return all.map(function(c) {
      var label = c.senderId === actor.id ? "\u4F60 -> " + c.target : c.sender + " -> \u4F60";
      return "[\u79C1\u804A] " + label + ": " + c.text;
    }).join("\n");
  }
  function getTimelineIcon(entry) {
    if (entry.type === "phase") {
      if (entry.text.includes("\u591C\u665A")) return { icon: "\u{1F319}", cls: "night" };
      if (entry.text.includes("\u767D\u5929")) return { icon: "\u2600\uFE0F", cls: "day" };
      return { icon: "\u25C6", cls: "" };
    }
    if (entry.type === "night") return { icon: "\u{1F319}", cls: "night" };
    if (entry.text.includes("\u6B7B\u4EA1") || entry.text.includes("\u51FB\u6740")) return { icon: "\u{1F480}", cls: "death" };
    if (entry.text.includes("\u5904\u51B3")) return { icon: "\u2694\uFE0F", cls: "execution" };
    if (entry.text.includes("\u63D0\u540D")) return { icon: "\u261D\uFE0F", cls: "" };
    if (entry.text.includes("\u6295\u7968")) return { icon: "\u{1F5F3}\uFE0F", cls: "" };
    return { icon: "\u25CB", cls: "" };
  }

  // js/settings.js
  function restoreSettings() {
    modelSelect.value = localStorage.getItem(MODEL_STORAGE) || DEFAULT_MODEL;
    autoNightToggle.checked = localStorage.getItem(AUTO_NIGHT_STORAGE) !== "0";
    if (trajectoryToggle) {
      trajectoryToggle.checked = localStorage.getItem(TRAJECTORY_STORAGE) === "1";
    }
    const storedMinutes = Number(localStorage.getItem(DAY_DISCUSSION_STORAGE));
    const minutes = Number.isFinite(storedMinutes) && storedMinutes > 0 ? storedMinutes : DEFAULT_DAY_DISCUSSION_MINUTES;
    if (dayDiscussionMinutesInput) {
      dayDiscussionMinutesInput.value = minutes;
    }
    if (state && !state.started) {
      state.discussionDurationSeconds = minutes * 60;
      state.discussionMaxRemaining = minutes * 60;
    }
    if (state) {
      state.recordTrajectories = trajectoryToggle ? trajectoryToggle.checked : false;
    }
  }
  function randomizeAiModels() {
    if (!state || !Array.isArray(state.players) || !state.players.length) {
      alert("\u8BF7\u5148\u751F\u6210\u73A9\u5BB6\u3002");
      return;
    }
    const pool = MODEL_OPTIONS.filter((option) => {
      const [providerId] = String(option.value || "").split(":");
      if (!providerId) return false;
      const health = getProviderHealth(providerId);
      return Boolean(health && health.status !== "error");
    }).map((option) => option.value);
    if (!pool.length) {
      alert("\u5F53\u524D\u6CA1\u6709\u901A\u8FC7\u5065\u5EB7\u68C0\u67E5\u7684\u53EF\u7528\u6A21\u578B\uFF0C\u65E0\u6CD5\u968F\u673A\u5206\u914D\u3002");
      return;
    }
    state.players.forEach((player) => {
      if (player.isHuman) return;
      player.modelChoice = pool[Math.floor(Math.random() * pool.length)];
    });
    addChat("\u7CFB\u7EDF", `\u5DF2\u4ECE ${pool.length} \u4E2A\u5065\u5EB7\u6A21\u578B\u4E2D\u968F\u673A\u5206\u914D AI \u6A21\u578B\u3002`, "system");
    renderAll();
  }
  function initModelSelect() {
    if (!modelSelect) return;
    modelSelect.innerHTML = "";
    MODEL_OPTIONS.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.value;
      opt.textContent = option.label;
      modelSelect.appendChild(opt);
    });
    const saved3 = localStorage.getItem(MODEL_STORAGE) || DEFAULT_MODEL;
    const hasSaved = MODEL_OPTIONS.some((opt) => opt.value === saved3);
    if (hasSaved) {
      modelSelect.value = saved3;
    } else if (MODEL_OPTIONS.length) {
      modelSelect.value = MODEL_OPTIONS[0].value;
      localStorage.setItem(MODEL_STORAGE, MODEL_OPTIONS[0].value);
    }
  }
  function initRoleSelect() {
    if (!humanRoleSelect) return;
    humanRoleSelect.innerHTML = "";
    const randomOption = document.createElement("option");
    randomOption.value = "random";
    randomOption.textContent = "\u968F\u673A";
    humanRoleSelect.appendChild(randomOption);
    SCRIPT.roles.forEach((role) => {
      if (role.name === "\u9152\u9B3C") return;
      const option = document.createElement("option");
      option.value = role.id;
      option.textContent = `${role.name} (${role.team})`;
      humanRoleSelect.appendChild(option);
    });
  }
  function openSettingsDrawer() {
    const settingsDrawer = document.getElementById("settingsDrawer");
    const drawerOverlay2 = document.getElementById("drawerOverlay");
    settingsDrawer.classList.add("open");
    drawerOverlay2.classList.add("open");
  }
  function closeSettingsDrawer() {
    const settingsDrawer = document.getElementById("settingsDrawer");
    const drawerOverlay2 = document.getElementById("drawerOverlay");
    settingsDrawer.classList.remove("open");
    drawerOverlay2.classList.remove("open");
  }
  function updateHeaderPhase() {
    const dot = document.getElementById("headerPhaseDot");
    const text = document.getElementById("headerPhaseText");
    if (!dot || !text) return;
    if (!state || !state.started) {
      dot.className = "phase-dot";
      text.textContent = "\u672A\u5F00\u5C40";
      return;
    }
    if (state.ended) {
      dot.className = "phase-dot ended";
      text.textContent = "\u5DF2\u7ED3\u675F";
      return;
    }
    if (state.phase === "night") {
      dot.className = "phase-dot night";
      text.textContent = `\u591C\u665A ${state.nightCount}`;
    } else if (state.phase === "day" && state.dayStage === "nomination") {
      dot.className = "phase-dot dusk";
      text.textContent = `\u767D\u5929 ${state.dayCount} \xB7 \u63D0\u540D (\u9EC4\u660F)`;
    } else {
      dot.className = "phase-dot day";
      text.textContent = `\u767D\u5929 ${state.dayCount} \xB7 \u8BA8\u8BBA`;
    }
  }

  // js/model-catalog.js
  var DEFAULT_CATALOG_YAML = `
api_keys:
  mimo: "YOUR_MIMO_KEY"
  deepseek: "YOUR_DEEPSEEK_KEY"
  gemini: "YOUR_GEMINI_KEY"
  claude: "YOUR_CLAUDE_KEY"
  gpt: "YOUR_GPT_KEY"
  openrouter: "YOUR_OPENROUTER_KEY"

providers:
  deepseek:
    label: "DeepSeek"
    base_url: "https://api.deepseek.com/v1"
    api_key: "\${deepseek}"
    protocol: "openai"
    models:
      - "deepseek-chat"
      - "deepseek-reasoner"
    default_model: "deepseek-chat"

  gemini:
    label: "Gemini"
    base_url: ""
    api_key: "\${gemini}"
    protocol: "openai"
    models:
      - "gemini-3-pro-preview-high"
      - "gemini-3-pro-preview-low"
      - "gemini-3-pro-preview"
      - "gemini-3-flash-preview"

  claude:
    label: "Claude"
    base_url: ""
    api_key: "\${claude}"
    protocol: "claude"
    models:
      - "claude-3-5-haiku-20241022"
      - "claude-3-7-sonnet-20250219"
      - "claude-3-7-sonnet-20250219-thinking"
      - "claude-3-haiku-20240307"
      - "claude-haiku-4-5-20251001"
      - "claude-haiku-4-5-20251001-thinking"
      - "claude-opus-4-1-20250805"
      - "claude-opus-4-1-20250805-thinking"
      - "claude-opus-4-20250514"
      - "claude-opus-4-20250514-thinking"
      - "claude-opus-4-5-20251101"
      - "claude-opus-4-5-20251101-thinking"
      - "claude-sonnet-4-20250514"
      - "claude-sonnet-4-20250514-thinking"
      - "claude-sonnet-4-5-20250929"
      - "claude-sonnet-4-5-20250929-thinking"

  gpt:
    label: "GPT"
    base_url: ""
    api_key: "\${gpt}"
    protocol: "openai"
    models:
      - "gpt-5.1-2025-11-13"
      - "gpt-5-chat-2025-08-07"

  mimo:
    label: "MiMo"
    base_url: "https://api.xiaomimimo.com/v1"
    api_key: "\${mimo}"
    protocol: "openai"
    models:
      - "mimo-v2-pro"
      - "mimo-v2-omni"
    default_model: "mimo-v2-pro"

  openrouter:
    label: "OpenRouter"
    base_url: "https://openrouter.ai/api/v1"
    api_key: "\${openrouter}"
    protocol: "openai"
    models:
      - "xiaomi/mimo-v2-pro"
      - "minimax/minimax-m2.7"
      - "openai/gpt-5.4"
      - "google/gemini-3.1-pro-preview"
      - "anthropic/claude-sonnet-4.6"
    default_model: "anthropic/claude-sonnet-4.6"
    headers:
      HTTP-Referer: "\${origin}"
`;
  var LOCAL_API_KEYS_STORAGE = "botc_user_api_keys";
  var lastRawCatalogData = null;
  function loadLocalApiKeys() {
    try {
      const raw = localStorage.getItem(LOCAL_API_KEYS_STORAGE);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  function saveLocalApiKeys(keys) {
    localStorage.setItem(LOCAL_API_KEYS_STORAGE, JSON.stringify(keys || {}));
  }
  function clearLocalApiKeys() {
    localStorage.removeItem(LOCAL_API_KEYS_STORAGE);
  }
  function getKnownApiKeyNames() {
    if (lastRawCatalogData) {
      const keys = lastRawCatalogData.api_keys || lastRawCatalogData.variables || lastRawCatalogData.secrets || {};
      return Object.keys(keys);
    }
    return ["deepseek", "gemini", "claude", "gpt", "mimo", "openrouter"];
  }
  function reapplyApiKeysFromUI(newKeys) {
    saveLocalApiKeys(newKeys);
    if (!lastRawCatalogData) return;
    const catalog = normalizeModelCatalog(lastRawCatalogData);
    if (catalog) {
      setModelCatalogLoadStatus({ ok: true, message: "\u5DF2\u5E94\u7528\u7528\u6237\u5BC6\u94A5" });
      applyModelCatalog(catalog);
    }
  }
  function looksLikePlaceholderKey(value) {
    const raw = String(value || "").trim();
    if (!raw) return true;
    if (/\$\{[^}]+\}/.test(raw)) return true;
    if (/^YOUR_[A-Z0-9_]*KEY$/i.test(raw)) return true;
    if (/^(your|replace|example|test)[-_ ]?(api)?[-_ ]?key$/i.test(raw)) return true;
    return false;
  }
  function buildProviderEndpoint(providerConfig) {
    if (!providerConfig) return "";
    const cleaned = String(providerConfig.baseUrl || "").trim().replace(/\/+$/, "");
    const protocol = providerConfig.protocol || "openai";
    if (!cleaned) return "";
    if (protocol === "claude") {
      return cleaned.includes("/messages") ? cleaned : `${cleaned}/v1/messages`;
    }
    if (cleaned.includes("/chat/completions")) {
      return cleaned;
    }
    return cleaned.endsWith("/v1") ? `${cleaned}/chat/completions` : `${cleaned}/v1/chat/completions`;
  }
  function getProviderHealth(providerId) {
    if (!providerId) return null;
    return modelCatalogHealth.find((item) => item.id === providerId) || null;
  }
  function getDefaultModelChoice() {
    return modelSelect?.value || DEFAULT_MODEL;
  }
  function getEffectiveModelChoice(actor) {
    if (actor && actor.modelChoice && actor.modelChoice !== "default") {
      return actor.modelChoice;
    }
    return getDefaultModelChoice();
  }
  function parseModelChoice(choice) {
    if (!choice) return { provider: "", model: "" };
    const parts = choice.split(":");
    if (parts.length < 2) return { provider: parts[0], model: "" };
    return { provider: parts[0], model: parts.slice(1).join(":") };
  }
  function resolveCatalogString(value, variables) {
    if (typeof value !== "string") return value;
    return value.replace(/\$\{([A-Za-z0-9_-]+)\}/g, (match, key) => {
      if (variables && Object.prototype.hasOwnProperty.call(variables, key)) {
        return String(variables[key]);
      }
      return match;
    });
  }
  function normalizeModelEntry(entry) {
    if (!entry) return null;
    if (typeof entry === "string") {
      const name = entry.trim();
      return name ? { name } : null;
    }
    if (typeof entry === "object") {
      const name = String(entry.name || entry.id || entry.model || "").trim();
      return name ? { name } : null;
    }
    return null;
  }
  function normalizeProviderHeaders(rawHeaders, variables = null) {
    if (!rawHeaders || typeof rawHeaders !== "object" || Array.isArray(rawHeaders)) {
      return {};
    }
    const normalized = {};
    Object.entries(rawHeaders).forEach(([key, value]) => {
      const headerName = String(key || "").trim();
      if (!headerName) return;
      const headerValue = resolveCatalogString(String(value || "").trim(), variables);
      if (!headerValue) return;
      normalized[headerName] = headerValue;
    });
    return normalized;
  }
  function normalizeProviderEntry(entry, variables = null) {
    if (!entry) return null;
    const id = String(entry.id || entry.name || entry.provider || "").trim();
    if (!id) return null;
    const label = String(entry.label || entry.title || id).trim();
    const baseUrlRaw = String(entry.base_url || entry.baseUrl || entry.url || "").trim();
    const apiKeyRaw = String(entry.api_key || entry.apiKey || entry.key || "").trim();
    const baseUrl = resolveCatalogString(baseUrlRaw, variables);
    const apiKey = resolveCatalogString(apiKeyRaw, variables);
    const protocolRaw = String(entry.protocol || entry.connection || entry.endpoint_type || entry.type || "").trim().toLowerCase();
    const protocol = protocolRaw === "claude" || protocolRaw === "anthropic" ? "claude" : "openai";
    const defaultModel = resolveCatalogString(String(entry.default_model || entry.defaultModel || "").trim(), variables);
    const apiKeyRequired = typeof entry.api_key_required === "boolean" ? entry.api_key_required : null;
    const headers = normalizeProviderHeaders(entry.headers || entry.extra_headers || entry.default_headers, variables);
    let rawModels = Array.isArray(entry.models) ? entry.models : entry.model ? [entry.model] : [];
    if (!rawModels.length && defaultModel) rawModels = [defaultModel];
    const models = rawModels.map((item) => {
      if (typeof item === "string") {
        return resolveCatalogString(item, variables);
      }
      if (item && typeof item === "object") {
        const name = resolveCatalogString(item.name || item.id || item.model || "", variables);
        return name ? { name } : null;
      }
      return item;
    }).map(normalizeModelEntry).filter(Boolean);
    return { id, label, baseUrl, apiKey, protocol, defaultModel, apiKeyRequired, headers, models };
  }
  function validateProviderHealth(provider) {
    const errors = [];
    const warnings = [];
    const models = Array.isArray(provider.models) ? provider.models.map((m) => m.name).filter(Boolean) : [];
    const requiresKey = typeof provider.apiKeyRequired === "boolean" ? provider.apiKeyRequired : true;
    const endpoint = buildProviderEndpoint(provider);
    if (!provider.baseUrl) {
      errors.push("\u7F3A\u5C11 base_url");
    } else if (!/^https?:\/\//i.test(provider.baseUrl)) {
      warnings.push("base_url \u4E0D\u662F http/https \u5730\u5740");
    }
    if (!endpoint) {
      errors.push("\u65E0\u6CD5\u751F\u6210\u8BF7\u6C42\u7AEF\u70B9");
    }
    if (!models.length) {
      errors.push("models \u4E3A\u7A7A");
    }
    if (provider.defaultModel && models.length && !models.includes(provider.defaultModel)) {
      warnings.push("default_model \u4E0D\u5728 models \u5217\u8868\u4E2D");
    }
    if (requiresKey) {
      if (!provider.apiKey) {
        errors.push("\u7F3A\u5C11 api_key");
      } else if (looksLikePlaceholderKey(provider.apiKey)) {
        errors.push("api_key \u4ECD\u662F\u5360\u4F4D\u503C\u6216\u672A\u89E3\u6790\u53D8\u91CF");
      }
    }
    const status = errors.length ? "error" : warnings.length ? "warning" : "ready";
    return {
      id: provider.id,
      label: provider.label || provider.id,
      protocol: provider.protocol || "openai",
      modelCount: models.length,
      status,
      errors,
      warnings
    };
  }
  function runModelCatalogHealthCheck() {
    const providers = loadedModelCatalog?.providers;
    if (!Array.isArray(providers) || !providers.length) {
      setModelCatalogHealth([]);
      renderModelHealthCheck();
      return modelCatalogHealth;
    }
    const seen = /* @__PURE__ */ new Set();
    setModelCatalogHealth(providers.map((provider) => {
      const result = validateProviderHealth(provider);
      if (seen.has(result.id)) {
        result.status = "error";
        result.errors = result.errors.concat("provider id \u91CD\u590D");
      }
      seen.add(result.id);
      return result;
    }));
    renderModelHealthCheck();
    const readyCount = modelCatalogHealth.filter((item) => item.status === "ready" || item.status === "warning").length;
    if (!readyCount && !modelHealthWarned) {
      setModelHealthWarned(true);
      showModal("\u6A21\u578B\u914D\u7F6E\u6821\u9A8C\u672A\u901A\u8FC7\uFF1A\u5F53\u524D\u6CA1\u6709\u53EF\u7528 provider\uFF0C\u8BF7\u5728\u8BBE\u7F6E\u4E2D\u586B\u5199 API \u5BC6\u94A5\u6216\u68C0\u67E5 model_catalog.yaml\u3002");
    }
    return modelCatalogHealth;
  }
  function parseModelCatalogText(text) {
    const trimmed = String(text || "").trim();
    if (!trimmed) {
      return { data: null, error: "model_catalog.yaml \u4E3A\u7A7A" };
    }
    if (window.jsyaml && typeof window.jsyaml.load === "function") {
      try {
        return { data: window.jsyaml.load(trimmed), error: "" };
      } catch (error) {
        return { data: null, error: `YAML \u89E3\u6790\u5931\u8D25\uFF1A${error?.message || "\u683C\u5F0F\u9519\u8BEF"}` };
      }
    }
    try {
      return { data: JSON.parse(trimmed), error: "" };
    } catch (error) {
      return { data: null, error: `JSON \u89E3\u6790\u5931\u8D25\uFF1A${error?.message || "\u683C\u5F0F\u9519\u8BEF"}` };
    }
  }
  function normalizeModelCatalog(raw) {
    if (!raw) return null;
    lastRawCatalogData = raw;
    const userVariables = raw.api_keys || raw.variables || raw.secrets || {};
    const localKeys = loadLocalApiKeys();
    const mergedKeys = { ...userVariables };
    Object.entries(localKeys).forEach(([k, v]) => {
      if (v && typeof v === "string" && v.trim()) mergedKeys[k] = v.trim();
    });
    setCatalogApiKeys(mergedKeys);
    const runtimeVariables = {
      origin: window.location?.origin || "",
      host: window.location?.host || "",
      protocol: window.location?.protocol || ""
    };
    const variables = {
      ...runtimeVariables,
      ...mergedKeys
    };
    let providers = [];
    if (Array.isArray(raw)) {
      providers = raw;
    } else if (Array.isArray(raw.providers)) {
      providers = raw.providers;
    } else if (raw.providers && typeof raw.providers === "object") {
      providers = Object.entries(raw.providers).map(([id, value]) => ({
        ...value || {},
        id
      }));
    }
    const normalized = providers.map((entry) => normalizeProviderEntry(entry, variables)).filter(Boolean);
    return normalized.length ? { providers: normalized } : null;
  }
  function refreshModelOptionsFromCatalog() {
    const hasCatalog = loadedModelCatalog && Array.isArray(loadedModelCatalog.providers) && loadedModelCatalog.providers.length > 0;
    if (!hasCatalog) {
      setMODEL_OPTIONS([]);
      return;
    }
    const newOptions = [];
    const seen = /* @__PURE__ */ new Set();
    loadedModelCatalog.providers.forEach((provider) => {
      const modelNames = provider.models.map((m) => m.name);
      modelNames.forEach((name) => {
        const value = `${provider.id}:${name}`;
        if (seen.has(value)) return;
        newOptions.push({ value, label: `${provider.label} / ${name}` });
        seen.add(value);
      });
    });
    setMODEL_OPTIONS(newOptions);
  }
  function applyModelCatalog(catalog) {
    setLoadedModelCatalog(catalog);
    const newMap = {};
    if (catalog && Array.isArray(catalog.providers)) {
      catalog.providers.forEach((provider) => {
        newMap[provider.id] = provider;
      });
    }
    setCustomProviderMap(newMap);
    refreshModelOptionsFromCatalog();
    initModelSelect();
    runModelCatalogHealthCheck();
    renderAll();
  }
  function getCustomProviderConfig(providerId) {
    if (!providerId) return null;
    return customProviderMap[providerId] || null;
  }
  function renderModelHealthCheck() {
    if (!modelHealthBox) return;
    modelHealthBox.innerHTML = "";
    const summary = document.createElement("div");
    summary.className = "model-health-summary";
    if (!modelCatalogLoadStatus.ok) {
      summary.classList.add("error");
      summary.textContent = `\u52A0\u8F7D\u5931\u8D25\uFF1A${modelCatalogLoadStatus.message || "\u65E0\u6CD5\u8BFB\u53D6 model_catalog.yaml"}`;
      modelHealthBox.appendChild(summary);
      return;
    }
    const total = modelCatalogHealth.length;
    const okCount = modelCatalogHealth.filter((item) => item.status === "ready").length;
    const warnCount = modelCatalogHealth.filter((item) => item.status === "warning").length;
    const errCount = modelCatalogHealth.filter((item) => item.status === "error").length;
    summary.textContent = `\u542F\u52A8\u5065\u5EB7\u68C0\u67E5\uFF1A\u53EF\u7528 ${okCount + warnCount}/${total}\uFF08\u901A\u8FC7 ${okCount}\uFF0C\u8B66\u544A ${warnCount}\uFF0C\u5931\u8D25 ${errCount}\uFF09`;
    modelHealthBox.appendChild(summary);
    const list = document.createElement("div");
    list.className = "model-health-list";
    modelCatalogHealth.forEach((item) => {
      const card = document.createElement("div");
      card.className = `model-health-item ${item.status}`;
      const head = document.createElement("div");
      head.className = "model-health-head";
      const name = document.createElement("span");
      name.className = "model-health-provider";
      name.textContent = `${item.label} (${item.protocol})`;
      const badge = document.createElement("span");
      badge.className = "model-health-badge";
      badge.textContent = item.status === "ready" ? "\u901A\u8FC7" : item.status === "warning" ? "\u8B66\u544A" : "\u5931\u8D25";
      head.appendChild(name);
      head.appendChild(badge);
      card.appendChild(head);
      const details = [];
      details.push(`models: ${item.modelCount}`);
      if (item.errors.length) details.push(`\u9519\u8BEF: ${item.errors.join("\uFF1B")}`);
      if (item.warnings.length) details.push(`\u8B66\u544A: ${item.warnings.join("\uFF1B")}`);
      const detail = document.createElement("div");
      detail.className = "model-health-detail";
      detail.textContent = details.join("\n");
      card.appendChild(detail);
      list.appendChild(card);
    });
    modelHealthBox.appendChild(list);
  }
  function showModelCatalogFallback() {
    const el = document.getElementById("modelCatalogFallback");
    if (el) el.style.display = "block";
  }
  function hideModelCatalogFallback() {
    const el = document.getElementById("modelCatalogFallback");
    if (el) el.style.display = "none";
  }
  function loadModelCatalogFromText(text) {
    const parsed = parseModelCatalogText(text);
    if (!parsed.data) {
      if (typeof alert === "function") alert(parsed.error || "\u89E3\u6790\u5931\u8D25");
      return false;
    }
    const catalog = normalizeModelCatalog(parsed.data);
    if (!catalog) {
      if (typeof alert === "function") alert("providers \u4E3A\u7A7A\u6216\u683C\u5F0F\u4E0D\u6B63\u786E");
      return false;
    }
    setModelCatalogLoadStatus({ ok: true, message: "\u5DF2\u4ECE\u672C\u5730\u6587\u4EF6\u52A0\u8F7D" });
    applyModelCatalog(catalog);
    renderModelHealthCheck();
    hideModelCatalogFallback();
    return true;
  }
  async function autoLoadModelCatalog() {
    setModelCatalogLoadStatus({ ok: false, message: "\u6B63\u5728\u52A0\u8F7D model_catalog.yaml..." });
    renderModelHealthCheck();
    let text = null;
    let fromYaml = false;
    try {
      const response = await fetch("model_catalog.yaml", { cache: "no-store" });
      if (response.ok) {
        text = await response.text();
        fromYaml = true;
      }
    } catch {
    }
    if (!text) {
      text = DEFAULT_CATALOG_YAML;
      fromYaml = false;
    }
    const parsed = parseModelCatalogText(text);
    if (!parsed.data) {
      setModelCatalogLoadStatus({ ok: false, message: parsed.error || "\u89E3\u6790\u5931\u8D25" });
      renderModelHealthCheck();
      showModelCatalogFallback();
      return modelCatalogLoadStatus;
    }
    const catalog = normalizeModelCatalog(parsed.data);
    if (!catalog) {
      setModelCatalogLoadStatus({ ok: false, message: "providers \u4E3A\u7A7A\u6216\u683C\u5F0F\u4E0D\u6B63\u786E" });
      renderModelHealthCheck();
      showModelCatalogFallback();
      return modelCatalogLoadStatus;
    }
    const msg = fromYaml ? "\u52A0\u8F7D\u6210\u529F" : "\u5DF2\u4F7F\u7528\u5185\u7F6E\u9ED8\u8BA4\u914D\u7F6E\uFF08\u8BF7\u5728\u9875\u9762\u4E2D\u586B\u5199 API \u5BC6\u94A5\uFF09";
    setModelCatalogLoadStatus({ ok: true, message: msg });
    applyModelCatalog(catalog);
    if (fromYaml) {
      hideModelCatalogFallback();
    }
    return modelCatalogLoadStatus;
  }
  function getModelConfig(actor) {
    const choice = getEffectiveModelChoice(actor);
    const { provider, model } = parseModelChoice(choice);
    const temperature = Number(tempInput.value) || 1;
    const custom = getCustomProviderConfig(provider);
    if (!custom) {
      alert("\u672A\u627E\u5230\u6A21\u578B\u914D\u7F6E\uFF0C\u8BF7\u5728\u8BBE\u7F6E\u4E2D\u586B\u5199 API \u5BC6\u94A5\u6216\u68C0\u67E5 model_catalog.yaml\u3002");
      return {
        provider: provider || "",
        model: model || "",
        apiKey: "",
        endpoint: "",
        temperature,
        protocol: "openai",
        requiresKey: true
      };
    }
    const protocol = custom.protocol || "openai";
    const endpoint = buildProviderEndpoint(custom);
    const modelName = model === "default" ? custom.defaultModel || custom.models?.[0]?.name || model : model;
    const requiresKey = typeof custom.apiKeyRequired === "boolean" ? custom.apiKeyRequired : true;
    const providerHealth = getProviderHealth(provider);
    if (providerHealth && providerHealth.status === "error") {
      const reason = providerHealth.errors[0] || "\u914D\u7F6E\u4E0D\u5B8C\u6574";
      alert(`${providerHealth.label} \u914D\u7F6E\u5F02\u5E38\uFF1A${reason}`);
    }
    return {
      provider,
      model: modelName,
      apiKey: custom.apiKey || "",
      endpoint,
      temperature,
      protocol,
      requiresKey,
      headers: custom.headers || {},
      label: custom.label || provider
    };
  }
  function getModelStartupReadiness() {
    if (!modelCatalogLoadStatus.ok) {
      return { ok: false, message: `\u6A21\u578B\u914D\u7F6E\u52A0\u8F7D\u5931\u8D25\uFF1A${modelCatalogLoadStatus.message || "\u8BF7\u68C0\u67E5 model_catalog.yaml"}` };
    }
    if (!Array.isArray(modelCatalogHealth) || !modelCatalogHealth.length) {
      return { ok: false, message: "\u672A\u53D1\u73B0\u53EF\u68C0\u67E5\u7684 provider\uFF0C\u8BF7\u68C0\u67E5 model_catalog.yaml.providers\u3002" };
    }
    const usable = modelCatalogHealth.filter((item) => item.status !== "error");
    if (!usable.length) {
      return { ok: false, message: "\u6A21\u578B\u914D\u7F6E\u672A\u901A\u8FC7\u5065\u5EB7\u68C0\u67E5\uFF1A\u6CA1\u6709\u53EF\u7528 provider\u3002" };
    }
    const choice = getDefaultModelChoice();
    const parsed = parseModelChoice(choice);
    if (!parsed.provider) {
      return { ok: false, message: "\u9ED8\u8BA4\u6A21\u578B\u672A\u8BBE\u7F6E\uFF0C\u8BF7\u5148\u5728\u8BBE\u7F6E\u4E2D\u9009\u62E9\u6A21\u578B\u3002" };
    }
    const selectedHealth = getProviderHealth(parsed.provider);
    if (!selectedHealth) {
      return { ok: false, message: `\u9ED8\u8BA4\u6A21\u578B provider \u672A\u627E\u5230\uFF1A${parsed.provider}` };
    }
    if (selectedHealth.status === "error") {
      const firstReason = selectedHealth.errors[0] || "\u914D\u7F6E\u5F02\u5E38";
      return { ok: false, message: `\u9ED8\u8BA4\u6A21\u578B provider \u6821\u9A8C\u5931\u8D25\uFF08${selectedHealth.label}\uFF09\uFF1A${firstReason}` };
    }
    return { ok: true, message: "" };
  }

  // js/api.js
  function lookupPricing(modelName) {
    if (!modelName) return null;
    const name = modelName.replace(/^[^/]+\//, "");
    if (MODEL_PRICING[name]) return MODEL_PRICING[name];
    for (const key of Object.keys(MODEL_PRICING)) {
      if (name.startsWith(key)) return MODEL_PRICING[key];
    }
    return null;
  }
  function ensureTokenUsage() {
    if (!state) return;
    if (!state.tokenUsage) state.tokenUsage = {};
  }
  function estimateCost(model, promptTokens, completionTokens) {
    const pricing = lookupPricing(model);
    if (!pricing) return 0;
    return promptTokens / 1e6 * pricing[0] + completionTokens / 1e6 * pricing[1];
  }
  function accumulateRawUsage(dst, src) {
    if (!src || typeof src !== "object") return;
    for (const key of Object.keys(src)) {
      const val = src[key];
      if (typeof val === "number") {
        dst[key] = (dst[key] || 0) + val;
      } else if (val && typeof val === "object" && !Array.isArray(val)) {
        if (!dst[key] || typeof dst[key] !== "object") dst[key] = {};
        accumulateRawUsage(dst[key], val);
      }
    }
  }
  function recordTokenUsage(model, usage) {
    if (!state || !usage) return;
    ensureTokenUsage();
    const key = model || "unknown";
    if (!state.tokenUsage[key]) {
      state.tokenUsage[key] = {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        calls: 0,
        cost: 0,
        costSource: {},
        rawUsage: {}
      };
    }
    const u = state.tokenUsage[key];
    u.promptTokens += usage.promptTokens || 0;
    u.completionTokens += usage.completionTokens || 0;
    u.totalTokens += usage.totalTokens || 0;
    u.calls += 1;
    u.cost += usage.cost || 0;
    const src = usage.costSource || "unknown";
    u.costSource[src] = (u.costSource[src] || 0) + 1;
    if (usage.rawUsage) {
      accumulateRawUsage(u.rawUsage, usage.rawUsage);
    }
  }
  function getTokenUsageSummary() {
    if (!state || !state.tokenUsage) return { models: {}, totalCost: 0, totalTokens: 0 };
    let totalCost = 0;
    let totalTokens = 0;
    const models = {};
    for (const [model, u] of Object.entries(state.tokenUsage)) {
      const hasPricing = u.cost > 0 || Boolean(lookupPricing(model));
      models[model] = { ...u, hasPricing };
      totalCost += u.cost || 0;
      totalTokens += u.totalTokens;
    }
    return { models, totalCost, totalTokens };
  }
  function shouldRecordTrajectory() {
    return Boolean(state && state.recordTrajectories);
  }
  function recordTrajectoryEntry(actor, sessionKey, provider, model, messages, responseText, reasoningText = "") {
    if (!shouldRecordTrajectory()) return;
    if (!Array.isArray(state.trajectoryLog)) state.trajectoryLog = [];
    state.trajectoryLog.push({
      time: (/* @__PURE__ */ new Date()).toISOString(),
      phase: getPhaseLabel(),
      day: state.dayCount,
      night: state.nightCount,
      actor: actor ? actor.name : "\u8BF4\u4E66\u4EBA",
      actorId: actor ? actor.id : "storyteller",
      sessionKey: sessionKey || "default",
      provider: provider || "",
      model: model || "",
      messages: JSON.parse(JSON.stringify(messages || [])),
      response: responseText || "",
      reasoning_content: reasoningText || ""
    });
  }
  function getMessageSession(actor, sessionKey) {
    if (!actor) return null;
    if (!actor.messageSessions || typeof actor.messageSessions !== "object") {
      actor.messageSessions = {};
    }
    const key = sessionKey || "default";
    if (!Array.isArray(actor.messageSessions[key])) {
      actor.messageSessions[key] = [];
    }
    return actor.messageSessions[key];
  }
  function dedupeSystemMessages(session, messages) {
    if (!session || !session.length) return messages.slice();
    return messages.filter((msg) => {
      if (msg.role !== "system") return true;
      return !session.some((m) => m.role === "system" && m.content === msg.content);
    });
  }
  function buildSessionMessages(actor, sessionKey, messages) {
    if (!USE_PERSISTENT_MESSAGES || !actor) {
      return { finalMessages: messages, session: null, newMessages: messages };
    }
    const session = getMessageSession(actor, sessionKey);
    const newMessages = dedupeSystemMessages(session, messages);
    return {
      finalMessages: session.concat(newMessages),
      session,
      newMessages
    };
  }
  function commitSessionMessages(actor, sessionKey, messages, assistantContent) {
    if (!actor) return;
    if (USE_PERSISTENT_MESSAGES) {
      const session = getMessageSession(actor, sessionKey);
      const newMessages = dedupeSystemMessages(session, messages);
      if (newMessages.length) session.push(...newMessages);
      session.push({ role: "assistant", content: assistantContent });
    }
    markActorPromptCursors(actor, sessionKey);
  }
  function splitClaudeMessages(messages) {
    const systemParts = [];
    const chat = [];
    messages.forEach((msg) => {
      if (!msg || typeof msg.content === "undefined") return;
      if (msg.role === "system") {
        systemParts.push(String(msg.content));
        return;
      }
      const role = msg.role === "assistant" ? "assistant" : "user";
      chat.push({ role, content: String(msg.content) });
    });
    return { system: systemParts.join("\n"), messages: chat };
  }
  function extractClaudeText(data) {
    if (!data) return "";
    if (Array.isArray(data.content)) {
      return data.content.map((part) => part.text || "").join("");
    }
    if (typeof data.output_text === "string") return data.output_text;
    return "";
  }
  function extractClaudeReasoning(data) {
    if (!data) return "";
    if (Array.isArray(data.content)) {
      return data.content.filter((part) => part.type === "thinking" || part.type === "reasoning").map((part) => part.thinking || part.text || part.reasoning || "").join("");
    }
    if (typeof data.thinking === "string") return data.thinking;
    if (typeof data.reasoning === "string") return data.reasoning;
    return "";
  }
  function isClaudeMessagesEndpoint(endpoint) {
    return /\/messages$/i.test(endpoint) || endpoint.includes("/v1/messages");
  }
  async function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }
  async function fetchWithRetry(url, options, timeoutMs, maxRetries = 2) {
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        const response = await fetchWithTimeout(url, options, timeoutMs);
        if (response.ok) return response;
        const errorText = await response.text();
        if ((response.status >= 500 || response.status === 429) && attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
          continue;
        }
        throw new Error(errorText || `API \u8BF7\u6C42\u5931\u8D25 (${response.status})`);
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
          continue;
        }
        throw error;
      }
    }
    throw lastError || new Error("API \u8BF7\u6C42\u5931\u8D25");
  }
  async function probeModelConnection(actor = null, timeoutMs = 8e3) {
    const config = getModelConfig(actor);
    const requiresKey = config.requiresKey !== false;
    const probeMaxTokens = 64;
    if (!config.endpoint) {
      return { ok: false, provider: config.provider, model: config.model, message: "\u7F3A\u5C11\u8BF7\u6C42\u7AEF\u70B9" };
    }
    if (requiresKey && !config.apiKey) {
      return { ok: false, provider: config.provider, model: config.model, message: "\u7F3A\u5C11 API Key" };
    }
    const useClaude = config.protocol === "claude" || isClaudeMessagesEndpoint(config.endpoint);
    try {
      if (useClaude) {
        const headers2 = {
          "content-type": "application/json",
          "x-api-key": config.apiKey || "",
          "anthropic-version": "2023-06-01"
        };
        Object.assign(headers2, config.headers || {});
        const response2 = await fetchWithTimeout(config.endpoint, {
          method: "POST",
          headers: headers2,
          body: JSON.stringify({
            model: config.model,
            messages: [{ role: "user", content: "ping" }],
            max_tokens: probeMaxTokens,
            temperature: 0
          })
        }, timeoutMs);
        if (!response2.ok) {
          const errorText = await response2.text().catch(() => "");
          return {
            ok: false,
            provider: config.provider,
            model: config.model,
            message: `HTTP ${response2.status}${errorText ? `: ${errorText.slice(0, 120)}` : ""}`
          };
        }
        return { ok: true, provider: config.provider, model: config.model, message: "" };
      }
      const headers = {
        "Content-Type": "application/json"
      };
      Object.assign(headers, config.headers || {});
      if (config.apiKey) {
        headers.Authorization = `Bearer ${config.apiKey}`;
      }
      const response = await fetchWithTimeout(config.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: "user", content: "ping" }],
          temperature: 0,
          max_tokens: probeMaxTokens,
          stream: false
        })
      }, timeoutMs);
      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        return {
          ok: false,
          provider: config.provider,
          model: config.model,
          message: `HTTP ${response.status}${errorText ? `: ${errorText.slice(0, 120)}` : ""}`
        };
      }
      return { ok: true, provider: config.provider, model: config.model, message: "" };
    } catch (error) {
      return {
        ok: false,
        provider: config.provider,
        model: config.model,
        message: error?.name === "AbortError" ? "\u8FDE\u63A5\u8D85\u65F6" : error?.message || "\u8BF7\u6C42\u5931\u8D25"
      };
    }
  }
  async function probeGameStartConnections() {
    const targets = [{ label: "\u8BF4\u4E66\u4EBA", actor: null }];
    if (state && Array.isArray(state.players)) {
      state.players.filter((player) => !player.isHuman).forEach((player) => targets.push({ label: player.name, actor: player }));
    }
    const uniqueTargets = [];
    const seen = /* @__PURE__ */ new Set();
    targets.forEach((entry) => {
      const config = getModelConfig(entry.actor);
      const key = `${config.provider}:${config.model}`;
      if (!config.provider || seen.has(key)) return;
      seen.add(key);
      uniqueTargets.push({ ...entry, config });
    });
    const failures = [];
    for (const entry of uniqueTargets) {
      const result = await probeModelConnection(entry.actor);
      if (!result.ok) {
        failures.push({
          label: entry.label,
          provider: result.provider,
          model: result.model,
          message: result.message
        });
      }
    }
    if (!failures.length) {
      return { ok: true, failures: [], message: "" };
    }
    const summary = failures.slice(0, 3).map((item) => `${item.provider || "\u672A\u77E5 provider"} / ${item.model || "\u672A\u77E5\u6A21\u578B"}\uFF1A${item.message}`).join("\n");
    return {
      ok: false,
      failures,
      message: `\u5F00\u5C40\u524D\u6A21\u578B\u8FDE\u901A\u6027\u68C0\u67E5\u5931\u8D25\uFF1A
${summary}${failures.length > 3 ? `
\u53E6\u6709 ${failures.length - 3} \u4E2A\u5931\u8D25\u9879\u3002` : ""}`
    };
  }
  async function callDeepSeek(messages, temperature, actor = null, sessionKey = "default", persist = true, options = null) {
    const config = getModelConfig(actor);
    const requiresKey = config.requiresKey !== false;
    if (!config.endpoint) {
      alert("\u6A21\u578B\u914D\u7F6E\u7F3A\u5C11 Base URL\uFF0C\u8BF7\u68C0\u67E5 YAML \u6216\u8BBE\u7F6E\u9879\u3002");
      throw new Error("Missing endpoint");
    }
    if (requiresKey && !config.apiKey) {
      const label = config.label || config.provider || "\u6A21\u578B";
      alert(`\u8BF7\u5148\u586B\u5199 ${label} API Key\u3002`);
      throw new Error("Missing API key");
    }
    const sessionPayload = buildSessionMessages(actor, sessionKey, messages);
    const timeoutMs = 6e4;
    const useClaude = config.protocol === "claude" || isClaudeMessagesEndpoint(config.endpoint);
    if (useClaude) {
      const headers2 = {
        "content-type": "application/json",
        "x-api-key": config.apiKey || "",
        "anthropic-version": "2023-06-01"
      };
      Object.assign(headers2, config.headers || {});
      const { system, messages: claudeMessages } = splitClaudeMessages(sessionPayload.finalMessages);
      const body2 = {
        model: config.model,
        messages: claudeMessages,
        max_tokens: 32e3,
        temperature: typeof temperature === "number" ? temperature : config.temperature
      };
      if (system) body2.system = system;
      if (/thinking/i.test(config.model)) {
        body2.thinking = { type: "enabled", budget_tokens: 1e4 };
      }
      const response2 = await fetchWithRetry(config.endpoint, {
        method: "POST",
        headers: headers2,
        body: JSON.stringify(body2)
      }, timeoutMs);
      const data2 = await response2.json();
      const content2 = extractClaudeText(data2);
      const reasoning2 = extractClaudeReasoning(data2);
      if (data2.usage) {
        const rawUsage = data2.usage;
        const promptTokens = rawUsage.input_tokens || 0;
        const completionTokens = rawUsage.output_tokens || 0;
        const totalTokens = promptTokens + completionTokens;
        let cost = 0;
        let costSource = "local_estimate";
        if (typeof rawUsage.cost === "number") {
          cost = rawUsage.cost;
          costSource = "api";
        } else if (typeof data2.total_cost === "number") {
          cost = data2.total_cost;
          costSource = "api";
        } else {
          cost = estimateCost(config.model, promptTokens, completionTokens);
        }
        recordTokenUsage(config.model, { promptTokens, completionTokens, totalTokens, cost, costSource, rawUsage });
      }
      if (persist && actor) {
        commitSessionMessages(actor, sessionKey, messages, content2);
      }
      recordTrajectoryEntry(actor, sessionKey, config.provider, config.model, sessionPayload.newMessages, content2, reasoning2);
      renderTokenUsageDisplay2();
      return content2;
    }
    const headers = {
      "Content-Type": "application/json"
    };
    Object.assign(headers, config.headers || {});
    if (config.apiKey) {
      headers.Authorization = `Bearer ${config.apiKey}`;
    }
    const body = {
      model: config.model,
      messages: sessionPayload.finalMessages,
      temperature: typeof temperature === "number" ? temperature : config.temperature,
      stream: false
    };
    if (options && options.responseFormat) {
      body.response_format = options.responseFormat;
    }
    const response = await fetchWithRetry(config.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    }, timeoutMs);
    const data = await response.json();
    const message = data.choices?.[0]?.message || {};
    const content = message.content || "";
    const reasoning = message.reasoning_content || message.reasoning || "";
    if (data.usage) {
      const rawUsage = data.usage;
      const promptTokens = rawUsage.prompt_tokens || 0;
      const completionTokens = rawUsage.completion_tokens || 0;
      const totalTokens = rawUsage.total_tokens || promptTokens + completionTokens;
      let cost = 0;
      let costSource = "local_estimate";
      if (typeof rawUsage.cost === "number") {
        cost = rawUsage.cost;
        costSource = "api";
      } else if (typeof data.total_cost === "number") {
        cost = data.total_cost;
        costSource = "api";
      } else {
        cost = estimateCost(config.model, promptTokens, completionTokens);
      }
      recordTokenUsage(config.model, { promptTokens, completionTokens, totalTokens, cost, costSource, rawUsage });
    }
    if (persist && actor) {
      commitSessionMessages(actor, sessionKey, messages, content);
    }
    recordTrajectoryEntry(actor, sessionKey, config.provider, config.model, sessionPayload.newMessages, content, reasoning);
    renderTokenUsageDisplay2();
    return content;
  }
  function renderTokenUsageDisplay2() {
    const section = document.getElementById("tokenUsageSection");
    const container = document.getElementById("tokenUsageDisplay");
    if (!section || !container) return;
    const summary = getTokenUsageSummary();
    if (summary.totalTokens === 0) {
      section.style.display = "none";
      return;
    }
    section.style.display = "";
    const modelKeys = Object.keys(summary.models);
    const fmtNum = (n) => n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : String(n);
    const fmtCost = (c) => c < 0.01 ? "<$0.01" : "$" + c.toFixed(2);
    let rows = modelKeys.map((m) => {
      const u = summary.models[m];
      const costStr = u.hasPricing ? fmtCost(u.cost) : "\u2014";
      const srcCounts = u.costSource || {};
      const srcHint = Object.entries(srcCounts).map(([k, v]) => `${k}:${v}`).join(" ");
      return `<tr><td title="${m}">${m.length > 28 ? m.slice(0, 26) + "\u2026" : m}</td><td>${u.calls}</td><td>${fmtNum(u.promptTokens)}</td><td>${fmtNum(u.completionTokens)}</td><td>${fmtNum(u.totalTokens)}</td><td title="${srcHint}">${costStr}</td></tr>`;
    }).join("");
    const hasAnyPricing = modelKeys.some((m) => summary.models[m].hasPricing);
    container.innerHTML = `<table class="token-usage-table"><tr><th>\u6A21\u578B</th><th>\u8C03\u7528</th><th>\u8F93\u5165</th><th>\u8F93\u51FA</th><th>\u603B\u8BA1</th><th>\u8D39\u7528</th></tr>${rows}</table><div class="token-usage-total"><span>\u603B Token: <b>${fmtNum(summary.totalTokens)}</b></span>` + (hasAnyPricing ? `<span>\u9884\u4F30\u603B\u82B1\u8D39: <span class="cost">${fmtCost(summary.totalCost)}</span></span>` : `<span style="color:var(--muted)">\u90E8\u5206\u6A21\u578B\u65E0\u5B9A\u4EF7\u6570\u636E</span>`) + `</div>`;
  }

  // js/export.js
  function getReplayRoleLabel(player) {
    if (!player) return "\u672A\u77E5";
    const history = Array.isArray(player.roleHistory) ? player.roleHistory : [];
    let label = "";
    if (history.length > 1) {
      const parts = history.map((entry, idx) => {
        const roleLabel = entry.roleName || "\u672A\u77E5";
        if (idx === 0) return `\u521D\u59CB${roleLabel}`;
        const timeTag = entry.night ? `\u7B2C${entry.night}\u665A` : entry.day ? `\u7B2C${entry.day}\u5929` : "\u672A\u77E5\u65F6\u95F4";
        const reason = entry.reason ? `\uFF08${entry.reason}\uFF09` : "";
        return `${roleLabel}\uFF08${timeTag}${reason}\uFF09`;
      });
      label = parts.join(" \u2192 ");
    } else if (player.roleName === "\u9152\u9B3C") {
      const apparent = getApparentRole(player);
      if (apparent && apparent.name) {
        label = `${apparent.name}\uFF08\u9152\u9B3C\uFF09`;
      } else {
        label = player.roleName || "\u672A\u77E5";
      }
    } else {
      label = player.roleName || "\u672A\u77E5";
    }
    if (state && player.id === state.redHerringId) {
      label = `${label}\uFF08\u5E72\u6270\u9879\uFF09`;
    }
    return label;
  }
  function exportJson() {
    const payload = {
      script: SCRIPT.name,
      players: state.players.map((p) => ({
        name: p.name,
        roleId: p.roleId,
        roleName: p.roleName,
        displayRoleName: getReplayRoleLabel(p),
        team: p.team,
        privateInfo: p.privateInfo,
        memory: p.memory
      })),
      redHerring: state.players.find((p) => p.id === state.redHerringId)?.name || "",
      publicLog: state.publicLog || [],
      claims: state.claims || {},
      claimHistory: state.claimHistory || [],
      privateChat: state.privateChat || [],
      evilChat: state.evilChat || [],
      replayEvents: state.replayEvents || [],
      infoAudit: state.infoAudit || [],
      trajectoryCount: Array.isArray(state.trajectoryLog) ? state.trajectoryLog.length : 0,
      storytellerSummary: state.storySummary || "",
      log: state.log,
      chat: state.chat,
      tokenUsage: state.tokenUsage || {},
      tokenSummary: getTokenUsageSummary(),
      meta: {
        started: state.started,
        ended: state.ended,
        dayCount: state.dayCount,
        nightCount: state.nightCount,
        discussionRound: state.discussionRound
      }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "botc_singleplayer_replay.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  }
  function exportTrajectories() {
    if (!state || !Array.isArray(state.trajectoryLog) || !state.trajectoryLog.length) {
      alert(`\u6682\u65E0\u8F68\u8FF9\u8BB0\u5F55\u3002\u8BF7\u5148\u5F00\u542F"\u8BB0\u5F55 LLM \u8F68\u8FF9"\u3002`);
      return;
    }
    const sanitize = (value) => String(value || "unknown").replace(/[\\/:*?"<>|\s]+/g, "_");
    const groups = /* @__PURE__ */ new Map();
    state.trajectoryLog.forEach((entry) => {
      const key = entry.actorId || entry.actor || "unknown";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(entry);
    });
    groups.forEach((entries) => {
      const sorted = entries.slice().sort((a, b) => String(a.time).localeCompare(String(b.time)));
      const actorName = sorted[0]?.actor || "unknown";
      const providers = new Set(sorted.map((e) => e.provider).filter(Boolean));
      const models = new Set(sorted.map((e) => e.model).filter(Boolean));
      const providerLabel = providers.size === 1 ? Array.from(providers)[0] : "mixed";
      const modelLabel = models.size === 1 ? Array.from(models)[0] : "mixed";
      const filename = `botc_trajectory_${sanitize(actorName)}_${sanitize(providerLabel)}_${sanitize(modelLabel)}.jsonl`;
      const lines = [];
      sorted.forEach((entry) => {
        const messages = Array.isArray(entry.messages) ? entry.messages : [];
        messages.forEach((msg) => {
          if (!msg || !msg.role) return;
          lines.push(JSON.stringify({ role: msg.role, content: String(msg.content || "") }));
        });
        if (entry.response) {
          const assistantPayload = { role: "assistant", content: String(entry.response) };
          if (entry.reasoning_content) {
            assistantPayload.reasoning_content = String(entry.reasoning_content);
          }
          lines.push(JSON.stringify(assistantPayload));
        }
      });
      const blob = new Blob([lines.join("\n")], { type: "application/jsonl" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    });
  }
  async function generateStorySummary(options = {}) {
    const { silent = false, force = false } = options;
    if (!state || !state.ended) {
      if (!silent) alert("\u8BF7\u5728\u6E38\u620F\u7ED3\u675F\u540E\u751F\u6210\u590D\u76D8\u3002");
      return;
    }
    if (state.storySummaryPending) return;
    if (state.storySummary && !force) return;
    state.storySummaryPending = true;
    if (storySummaryBox) {
      storySummaryBox.textContent = "\u6B63\u5728\u751F\u6210\u590D\u76D8...";
    }
    const payload = {
      script: SCRIPT.name,
      players: state.players.map((p) => ({
        name: p.name,
        roleName: p.roleName,
        team: p.team,
        privateInfo: p.privateInfo
      })),
      redHerring: state.players.find((p) => p.id === state.redHerringId)?.name || "",
      publicLog: state.publicLog || [],
      privateChat: state.privateChat || [],
      evilChat: state.evilChat || [],
      replayEvents: state.replayEvents || [],
      chat: state.chat || [],
      meta: {
        dayCount: state.dayCount,
        nightCount: state.nightCount
      }
    };
    const prompt2 = [
      {
        role: "system",
        content: "\u4F60\u662F\u300A\u8840\u67D3\u949F\u697C\u300B\u7684\u8BF4\u4E66\u4EBA\uFF0C\u8BF7\u57FA\u4E8E\u590D\u76D8\u6570\u636E\u751F\u6210\u4E00\u4EFD\u4E2D\u6587\u6574\u4F53\u590D\u76D8\u3002"
      },
      {
        role: "user",
        content: `\u8BF7\u8F93\u51FA\u4E00\u4EFD\u5305\u542B\u4EE5\u4E0B\u5185\u5BB9\u7684\u590D\u76D8\uFF1A
1) \u5173\u952E\u8F6C\u6298\u4E0E\u5904\u51B3\u94FE\u8DEF
2) \u4E3B\u8981\u4FE1\u606F\u6E90\u4E0E\u8BEF\u5BFC\u6765\u6E90\uFF08\u5C24\u5176\u662F\u4E2D\u6BD2/\u9189\u9152\u5BFC\u81F4\u7684\u9519\u8BEF\u4FE1\u606F\uFF09
3) \u5584\u6076\u53CC\u65B9\u5173\u952E\u51B3\u7B56\u4E0E\u6210\u8D25\u70B9
4) \u53EF\u6539\u8FDB\u7684\u7B56\u7565\u5EFA\u8BAE

\u590D\u76D8\u6570\u636E\uFF08JSON\uFF09\uFF1A
${JSON.stringify(payload, null, 2)}`
      }
    ];
    try {
      const content = await callDeepSeek(prompt2, Number(tempInput.value) || 0.7, null, "summary", false);
      state.storySummary = (content || "").trim() || "\u751F\u6210\u5931\u8D25\u3002";
    } catch (error) {
      state.storySummary = "\u751F\u6210\u5931\u8D25\u3002";
    } finally {
      state.storySummaryPending = false;
    }
    renderReplay();
    saveState();
  }
  function renderReplay() {
    if (!state || !state.ended) {
      if (replayPanel) replayPanel.style.display = "none";
      return;
    }
    replayPanel.style.display = "";
    replayRoles.innerHTML = "";
    state.players.forEach((player) => {
      const li = document.createElement("li");
      li.textContent = `${player.name}\uFF1A${getReplayRoleLabel(player)}`;
      replayRoles.appendChild(li);
    });
    replayActions.innerHTML = "";
    const actions = state.replayEvents || [];
    if (!actions.length) {
      const li = document.createElement("li");
      li.textContent = "\u6682\u65E0\u591C\u665A\u884C\u4E3A\u8BB0\u5F55\u3002";
      replayActions.appendChild(li);
    } else {
      actions.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = `${entry.phase} \xB7 ${entry.text}`;
        replayActions.appendChild(li);
      });
    }
    if (replayPrivate) {
      replayPrivate.innerHTML = "";
      const privates = state.privateChat || [];
      if (!privates.length) {
        const li = document.createElement("li");
        li.textContent = "\u6682\u65E0\u79C1\u804A\u8BB0\u5F55\u3002";
        replayPrivate.appendChild(li);
      } else {
        privates.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = `${item.phase} \xB7 ${item.sender} -> ${item.target}: ${item.text}`;
          replayPrivate.appendChild(li);
        });
      }
    }
    replayChat.innerHTML = "";
    state.chat.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.phase} \xB7 ${item.speaker}: ${item.text}`;
      replayChat.appendChild(li);
    });
    if (storySummaryBox) {
      storySummaryBox.textContent = state.storySummary ? state.storySummary : "\u6682\u65E0";
    }
    if (storySummaryBtn) {
      storySummaryBtn.disabled = !state.ended || state.storySummaryPending;
    }
    if (state.ended && !state.storySummary && !state.storySummaryPending) {
      generateStorySummary({ silent: true });
    }
  }

  // js/nomination.js
  function clearNominationTimers() {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      setInactivityTimer(null);
    }
    if (countdownTimer) {
      clearInterval(countdownTimer);
      setCountdownTimer(null);
    }
    if (state) {
      state.nominationCountdown = 0;
    }
  }
  function clearVoteTimer() {
    if (voteTimer) {
      clearInterval(voteTimer);
      setVoteTimer(null);
    }
    if (state) {
      state.voteCountdown = 0;
    }
  }
  function startVoteCountdown(seconds) {
    clearVoteTimer();
    if (!state || !state.started || state.ended || state.paused) return;
    if (state.phase !== "day" || state.dayStage !== "nomination") return;
    if (state.nominationPhase !== "voting") return;
    if (state && Array.isArray(state.players)) {
      state.players.forEach((player) => {
        if (player && !player.alive && player.deadVoteUsed && !state.nominationVotes[player.id]) {
          recordVote(player, "no", "\u9057\u8A00\u7968\u5DF2\u7528");
        }
      });
      const humanDead = state.players.find((p) => p.isHuman && !p.alive && p.deadVoteUsed);
      if (humanDead) {
        if (!state.nominationVotes[humanDead.id]) {
          recordVote(humanDead, "no", "\u9057\u8A00\u7968\u5DF2\u7528");
        }
        state.humanVoted = true;
      }
    }
    state.voteCountdown = seconds;
    renderStatus();
    const human = state.players.find((p) => p.isHuman);
    if (human && !human.alive && !human.deadVoteUsed) {
      showModal("\u6295\u7968\u9636\u6BB5\u5F00\u59CB\uFF0C\u4F60\u6709\u9057\u8A00\u7968\u53EF\u6295\u4E00\u6B21\u3002\u5012\u8BA1\u65F6\u7ED3\u675F\u5C06\u9ED8\u8BA4\u5F03\u6743\u3002");
    } else {
      showModal("\u6295\u7968\u9636\u6BB5\u5F00\u59CB\uFF0C\u8BF7\u5728\u5012\u8BA1\u65F6\u7ED3\u675F\u524D\u5B8C\u6210\u6295\u7968\u3002");
    }
    setVoteTimer(setInterval(() => {
      if (!state || state.ended || state.phase !== "day" || state.dayStage !== "nomination" || state.nominationPhase !== "voting") {
        clearVoteTimer();
        return;
      }
      state.voteCountdown -= 1;
      if (state.voteCountdown <= 0) {
        clearVoteTimer();
        const human2 = state.players.find((p) => p.isHuman && p.alive);
        const humanPlayer = state.players.find((p) => p.isHuman);
        if (humanPlayer && !state.humanVoted) {
          if (humanPlayer.alive) {
            recordVote(humanPlayer, "no", "\u8D85\u65F6\u9ED8\u8BA4\u53CD\u5BF9");
          } else if (humanPlayer.deadVoteUsed) {
            recordVote(humanPlayer, "no", "\u9057\u8A00\u7968\u5DF2\u7528");
          }
          state.humanVoted = true;
        }
        maybeFinalizeVotes();
        return;
      }
      renderStatus();
    }, 1e3));
  }
  function startNominationCountdown(seconds) {
    clearNominationTimers();
    if (!state || !state.started || state.ended || state.paused) return;
    if (state.phase !== "day" || state.dayStage !== "discussion") return;
    state.nominationCountdown = seconds;
    renderStatus();
    setCountdownTimer(setInterval(() => {
      if (!state || state.ended || state.phase !== "day" || state.dayStage !== "discussion") {
        clearNominationTimers();
        return;
      }
      state.nominationCountdown -= 1;
      if (state.nominationCountdown <= 0) {
        clearNominationTimers();
        enterNomination();
        return;
      }
      renderStatus();
    }, 1e3));
  }
  function scheduleNominationTimeout() {
    clearNominationTimers();
    if (!state || !state.started || state.ended || state.paused) return;
    if (state.phase !== "day" || state.dayStage !== "discussion") return;
    const now = Date.now();
    const last = state.lastDiscussionAt || now;
    const idleMs = Math.max(0, now - last);
    if (idleMs >= 1e4) {
      startNominationCountdown(5);
      return;
    }
    setInactivityTimer(setTimeout(() => {
      startNominationCountdown(5);
    }, 1e4 - idleMs));
  }
  function enterNomination() {
    if (state && state.paused) return;
    clearNominationTimers();
    clearDayDiscussionTimer();
    clearVoteTimer();
    state.dayStage = "nomination";
    state.currentSpeakerId = "";
    state.currentNomineeId = "";
    state.currentNominatorId = "";
    state.currentVoterId = "";
    state.nominationPhase = "open";
    state.nominationStep = "";
    state.nominationOrder = [];
    state.nominationCursor = 0;
    state.nominationVoteOrder = [];
    state.nominationVoteCursor = 0;
    state.nominationVotes = {};
    state.dayNominationCount = 0;
    state.dayHighestVotes = 0;
    state.dayHighestNomineeId = "";
    state.dayHighestTied = false;
    state.pendingNominationQueue = [];
    state.pendingAiNominations = 0;
    state.humanNominationDone = false;
    state.nominationUsedIds = [];
    state.nomineeUsedIds = [];
    state.nominationInProgress = false;
    addChat("\u8BF4\u4E66\u4EBA", "\u8BA8\u8BBA\u7ED3\u675F\uFF0C\u8FDB\u5165\u63D0\u540D\u9636\u6BB5\u3002", "storyteller");
    addChat("\u7CFB\u7EDF", `\u73B0\u5728\u5F00\u59CB\u63D0\u540D\u9636\u6BB5\uFF08\u6BCF\u4EBA\u4EC5\u4E00\u6B21\u63D0\u540D\uFF0C\u6BCF\u4EBA\u6700\u591A\u88AB\u63D0\u540D\u4E00\u6B21\uFF09\u3002`, "system");
    addLogEntry("\u8FDB\u5165\u63D0\u540D\u9636\u6BB5", "phase");
    addReplayEvent("\u8FDB\u5165\u63D0\u540D\u9636\u6BB5", "day_action");
    renderAll();
    startNominationRound();
  }
  function getAliveOrder() {
    return state.players.filter((p) => p.alive).map((p) => p.id);
  }
  async function startNominationRound() {
    if (state && state.paused) return;
    state.nominationPhase = "open";
    state.currentSpeakerId = "";
    state.pendingNominationQueue = [];
    state.nominationInProgress = false;
    const human = state.players.find((p) => p.isHuman && p.alive);
    if (human) {
      state.currentSpeakerId = human.id;
      addChat("\u7CFB\u7EDF", "\u4F60\u53EF\u4EE5\u968F\u65F6\u63D0\u540D\u6216\u8DF3\u8FC7\u3002AI \u5C06\u5E76\u884C\u51B3\u5B9A\u662F\u5426\u63D0\u540D\u3002", "system");
    }
    const aiPlayers = state.players.filter((p) => p.alive && !p.isHuman);
    state.pendingAiNominations = aiPlayers.length;
    renderStatus();
    if (!aiPlayers.length) {
      maybeStartNextNomination();
      return;
    }
    aiPlayers.forEach((player) => {
      aiNominate(player).then((nomination) => {
        state.pendingAiNominations = Math.max(0, state.pendingAiNominations - 1);
        state.nominationUsedIds.push(player.id);
        if (state.paused) {
          return;
        }
        if (nomination && nomination.nomineeId && !state.nomineeUsedIds.includes(nomination.nomineeId)) {
          state.pendingNominationQueue.push({
            nominatorId: player.id,
            nomineeId: nomination.nomineeId,
            reason: nomination.reason || ""
          });
        }
        maybeStartNextNomination();
      }).catch(() => {
        state.pendingAiNominations = Math.max(0, state.pendingAiNominations - 1);
        state.nominationUsedIds.push(player.id);
        if (state.paused) {
          return;
        }
        maybeStartNextNomination();
      });
    });
    maybeStartNextNomination();
  }
  function maybeStartNextNomination() {
    if (!state.started || state.phase !== "day" || state.dayStage !== "nomination") return;
    if (state.nominationPhase !== "open") return;
    if (state.paused) return;
    if (state.nominationInProgress) return;
    if (state.dayNominationCount >= MAX_NOMINATIONS_PER_DAY) {
      state.nominationPhase = "";
      state.nominationStep = "";
      state.currentSpeakerId = "";
      finalizeDayExecution();
      return;
    }
    while (state.pendingNominationQueue.length) {
      const next = state.pendingNominationQueue.shift();
      if (!next) continue;
      if (state.nomineeUsedIds.includes(next.nomineeId)) continue;
      state.nomineeUsedIds.push(next.nomineeId);
      state.currentSpeakerId = "";
      startNominationResolution(next.nominatorId, next.nomineeId, next.reason || "");
      return;
    }
    if (state.pendingAiNominations > 0) {
      return;
    }
    const human = state.players.find((p) => p.isHuman && p.alive);
    if (human && !state.humanNominationDone) {
      state.currentSpeakerId = human.id;
      renderStatus();
      return;
    }
    state.nominationPhase = "";
    state.nominationStep = "";
    state.currentSpeakerId = "";
    finalizeDayExecution();
  }
  async function aiNominate(player) {
    if (state && state.paused) return null;
    const nominableTargets = state.players.filter((p) => !state.nomineeUsedIds.includes(p.id)).map((p) => `${p.name}${p.alive ? "" : "\uFF08\u5DF2\u6B7B\u4EA1\uFF09"}`);
    const recentChat = formatChatForPrompt(12, player, "json");
    const privateInfo = formatPrivateInfoForPrompt(player, "json", 4);
    const privateChatHistory = formatPlayerPrivateChats(player);
    const evilChatHistory = formatEvilChatForPrompt(player);
    const aliveDeadSummary = getAliveDeadSummary();
    const userContent = `\u516C\u5F00\u804A\u5929\uFF08\u6700\u8FD1\u589E\u91CF\uFF09\uFF1A
${recentChat}

        \u4F60\u7684\u79C1\u804A\u8BB0\u5F55\uFF1A
${privateChatHistory}
${evilChatHistory ? `
\u4F60\u7684\u90AA\u6076\u9635\u8425\u5BC6\u804A\u8BB0\u5F55\uFF1A
${evilChatHistory}
` : ""}
${aliveDeadSummary}
\u5F53\u524D\u63D0\u540D\u9636\u6BB5\uFF1A\u4F60\u53EF\u4EE5\u9009\u62E9\u662F\u5426\u63D0\u540D\u4E00\u540D\u73A9\u5BB6\uFF08\u5305\u62EC\u5DF2\u6B7B\u4EA1\u7684\u73A9\u5BB6\uFF09\u3002\u53EF\u63D0\u540D\u73A9\u5BB6\uFF1A${nominableTargets.join("\u3001")}\u3002
\u6BCF\u4EBA\u4EC5\u4E00\u6B21\u63D0\u540D\u673A\u4F1A\uFF0C\u6BCF\u4EBA\u6700\u591A\u88AB\u63D0\u540D\u4E00\u6B21\u3002
\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\u589E\u91CF\uFF1A${privateInfo}
\u8BF7\u8F93\u51FA JSON\uFF1A{"nominate":"yes|no","target":"\u73A9\u5BB6\u540D","reason":"\u4E00\u5C0F\u6BB5\u8BDD"}\u3002\u5982\u679C\u4E0D\u63D0\u540D\uFF0Ctarget\u4E3A\u7A7A\u5B57\u7B26\u4E32\u3002`;
    const prompt2 = buildPlayerPromptMessages(player, "json", userContent, {
      systemPrompt: PLAYER_JSON_SYSTEM_PROMPT
    });
    try {
      const content = await callDeepSeek(prompt2, Number(tempInput.value) || 1, player, "json");
      const json = extractJson(content);
      if (json && json.nominate === "yes") {
        const rawName = json.target || "";
        const targetName = rawName.replace(/\(真人\)/g, "").replace(/（已死亡）/g, "").trim();
        const target = state.players.find(
          (p) => !state.nomineeUsedIds.includes(p.id) && p.name === targetName
        );
        if (target) {
          return { nomineeId: target.id, reason: json.reason || "" };
        }
      }
    } catch (error) {
      return null;
    }
    return null;
  }
  async function startNominationResolution(nominatorId, nomineeId, reasonText = "") {
    if (state.nominationInProgress) return;
    state.nominationInProgress = true;
    const nominator = state.players.find((p) => p.id === nominatorId);
    const nominee = state.players.find((p) => p.id === nomineeId);
    if (!nominator || !nominee) {
      state.nominationInProgress = false;
      return;
    }
    if (state.dayNominationCount >= MAX_NOMINATIONS_PER_DAY) {
      state.nominationInProgress = false;
      addChat("\u7CFB\u7EDF", `\u4ECA\u65E5\u63D0\u540D\u5DF2\u8FBE\u4E0A\u9650\uFF08${MAX_NOMINATIONS_PER_DAY}\u6B21\uFF09\uFF0C\u76F4\u63A5\u8FDB\u5165\u7ED3\u7B97\u3002`, "system");
      finalizeDayExecution();
      return;
    }
    state.dayNominationCount += 1;
    addPublicLogEntry(`\u63D0\u540D\uFF1A${nominator.name} -> ${nominee.name}`);
    if (nominee.roleName === "\u8D1E\u6D01\u8005" && !nominee.virginUsed && nominator.team === "townsfolk" && !isDroisoned(nominee)) {
      nominee.virginUsed = true;
      nominator.alive = false;
      state.lastExecutedId = nominator.id;
      addChat("\u8BF4\u4E66\u4EBA", `${nominator.name} \u63D0\u540D ${nominee.name}\uFF0C\u89E6\u53D1\u8D1E\u6D01\u8005\u3002${nominator.name} \u88AB\u5904\u51B3\u3002`, "storyteller");
      addLogEntry(`\u8D1E\u6D01\u8005\u89E6\u53D1\u5904\u51B3\uFF1A${nominator.name}`, "day");
      addReplayEvent(`\u8D1E\u6D01\u8005\u89E6\u53D1\uFF1A${nominator.name} \u88AB\u5904\u51B3`, "day_action");
      addPublicLogEntry(`\u8D1E\u6D01\u8005\u89E6\u53D1\uFF1A${nominator.name} \u88AB\u5904\u51B3`);
      if (nominator.roleName === "\u5723\u5F92") {
        addChat("\u7CFB\u7EDF", "\u5723\u5F92\u88AB\u5904\u51B3\uFF0C\u90AA\u6076\u9635\u8425\u83B7\u80DC\u3002", "system");
        state.ended = true;
        state.winner = "evil";
        state.winCondition = "saint_executed";
      }
      state.nominationInProgress = false;
      renderAll();
      checkWin();
      if (!state.ended) {
        switchPhase();
      }
      return;
    }
    state.nominationPhase = "reason";
    state.nominationStep = "reason";
    state.currentNominatorId = nominatorId;
    state.currentNomineeId = nomineeId;
    state.currentSpeakerId = nominatorId;
    state.currentVoterId = "";
    state.nominationVotes = {};
    nomineeSelect.value = nomineeId;
    addChat("\u8BF4\u4E66\u4EBA", `${nominator.name} \u63D0\u540D ${nominee.name}\u3002`, "storyteller");
    addLogEntry(`\u63D0\u540D\uFF1A${nominee.name}`, "day", { nominator: nominator.name });
    addReplayEvent(`\u63D0\u540D\uFF1A${nominator.name} -> ${nominee.name}`, "day_action");
    renderAll();
    if (reasonText && reasonText.trim()) {
      addChat(nominator.name, reasonText.trim(), "player");
      await handleNominationReasonDone();
      return;
    }
    if (!nominator.isHuman) {
      const reason = await aiNominationReason(nominator, nominee);
      addChat(nominator.name, reason, "player");
      await handleNominationReasonDone();
      return;
    }
    const humanReason = await requestHumanStatement("\u8BF7\u9648\u8FF0\u63D0\u540D\u7406\u7531", "\u6211\u6CA1\u4EC0\u4E48\u60F3\u8BF4\u7684\u3002");
    addChat(nominator.name, humanReason, "player");
    await handleNominationReasonDone();
  }
  async function handleNominationReasonDone() {
    state.nominationPhase = "defense";
    state.nominationStep = "defense";
    state.currentSpeakerId = state.currentNomineeId;
    renderStatus();
    const nominee = state.players.find((p) => p.id === state.currentNomineeId);
    if (!nominee) return;
    if (!nominee.isHuman) {
      const defense = await aiNominationDefense(nominee);
      addChat(nominee.name, defense, "player");
      await handleNominationDefenseDone();
      return;
    }
    const humanDefense = await requestHumanStatement("\u4F60\u88AB\u63D0\u540D\u4E86\uFF0C\u8BF7\u7B80\u77ED\u8FA9\u89E3", "\u6211\u6CA1\u4EC0\u4E48\u60F3\u8BF4\u7684\u3002");
    addChat(nominee.name, humanDefense, "player");
    await handleNominationDefenseDone();
  }
  async function handleNominationDefenseDone() {
    startNominationVoting();
  }
  async function aiNominationReason(nominator, nominee) {
    const recentChat = formatChatForPrompt(12, nominator, "chat");
    const privateInfo = formatPrivateInfoForPrompt(nominator, "chat", 4);
    const privateChatHistory = formatPlayerPrivateChats(nominator);
    const evilChatHistory = formatEvilChatForPrompt(nominator);
    const aliveDeadSummary = getAliveDeadSummary();
    const userContent = `\u516C\u5F00\u804A\u5929\uFF08\u6700\u8FD1\u589E\u91CF\uFF09\uFF1A
${recentChat}

        \u4F60\u7684\u79C1\u804A\u8BB0\u5F55\uFF1A
${privateChatHistory}
${evilChatHistory ? `
\u4F60\u7684\u90AA\u6076\u9635\u8425\u5BC6\u804A\u8BB0\u5F55\uFF1A
${evilChatHistory}
` : ""}
${aliveDeadSummary}
\u4F60\u63D0\u540D\u4E86${nominee.name}\u3002
\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\u589E\u91CF\uFF1A${privateInfo}
\u8FD9\u662F\u4E00\u5C0F\u6BB5\u516C\u5F00\u53D1\u8A00\uFF0C\u4E0D\u8981\u8BF4\u5FC3\u7406\u6D3B\u52A8\u6216\u79C1\u5BC6\u4FE1\u606F\uFF0C\u4E0D\u8981\u5728\u62EC\u53F7\u91CC\u5199\u5FC3\u91CC\u8BDD\u3002
\u8BF7\u7528\u4E00\u5C0F\u6BB5\u8BDD\u8BF4\u660E\u7406\u7531\u3002`;
    const prompt2 = buildPlayerPromptMessages(nominator, "chat", userContent);
    try {
      const content = await callDeepSeek(prompt2, Number(tempInput.value) || 1, nominator, "chat");
      return content.trim() || "\u6211\u6CA1\u4EC0\u4E48\u60F3\u8BF4\u7684\u3002";
    } catch (error) {
      return "\u6211\u6CA1\u4EC0\u4E48\u60F3\u8BF4\u7684\u3002";
    }
  }
  async function aiNominationDefense(nominee) {
    const recentChat = formatChatForPrompt(12, nominee, "chat");
    const privateInfo = formatPrivateInfoForPrompt(nominee, "chat", 4);
    const privateChatHistory = formatPlayerPrivateChats(nominee);
    const evilChatHistory = formatEvilChatForPrompt(nominee);
    const aliveDeadSummary = getAliveDeadSummary();
    const userContent = `\u516C\u5F00\u804A\u5929\uFF08\u6700\u8FD1\u589E\u91CF\uFF09\uFF1A
${recentChat}

        \u4F60\u7684\u79C1\u804A\u8BB0\u5F55\uFF1A
${privateChatHistory}
${evilChatHistory ? `
\u4F60\u7684\u90AA\u6076\u9635\u8425\u5BC6\u804A\u8BB0\u5F55\uFF1A
${evilChatHistory}
` : ""}
${aliveDeadSummary}
\u4F60\u88AB\u63D0\u540D\u4E86\u3002
\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\u589E\u91CF\uFF1A${privateInfo}
\u8FD9\u662F\u516C\u5F00\u8FA9\u89E3\uFF0C\u4E0D\u8981\u8BF4\u5FC3\u7406\u6D3B\u52A8\u6216\u79C1\u5BC6\u4FE1\u606F\uFF0C\u4E0D\u8981\u5728\u62EC\u53F7\u91CC\u5199\u5FC3\u91CC\u8BDD\u3002
\u8BF7\u7528\u4E00\u5C0F\u6BB5\u8BDD\u8FA9\u89E3\u3002`;
    const prompt2 = buildPlayerPromptMessages(nominee, "chat", userContent);
    try {
      const content = await callDeepSeek(prompt2, Number(tempInput.value) || 1, nominee, "chat");
      return content.trim() || "\u6211\u6CA1\u4EC0\u4E48\u60F3\u8BF4\u7684\u3002";
    } catch (error) {
      return "\u6211\u6CA1\u4EC0\u4E48\u60F3\u8BF4\u7684\u3002";
    }
  }
  function buildNominationVoteOrder(nomineeId) {
    const alive = getAliveOrder();
    const index = alive.indexOf(nomineeId);
    if (index === -1) return alive;
    return alive.slice(index).concat(alive.slice(0, index));
  }
  function startNominationVoting() {
    if (state && state.paused) return;
    clearVoteTimer();
    const nominee = state.players.find((p) => p.id === state.currentNomineeId);
    state.nominationPhase = "voting";
    state.nominationStep = "voting";
    state.currentSpeakerId = "";
    state.nominationVoteOrder = buildNominationVoteOrder(state.currentNomineeId);
    state.nominationVoteCursor = 0;
    state.currentVoterId = "";
    state.nominationVotes = {};
    state.voteCountdown = 0;
    state.pendingAiVotes = 0;
    state.humanVoted = false;
    state.votingToken = (state.votingToken || 0) + 1;
    if (nominee) {
      addChat("\u8BF4\u4E66\u4EBA", `\u6295\u7968\u5F00\u59CB\uFF0C\u8BF7\u6240\u6709\u5B58\u6D3B\u73A9\u5BB6\u8868\u6001\u3002`, "storyteller");
    }
    renderAll();
    beginParallelVoting();
  }
  function beginParallelVoting() {
    if (!state.started || state.phase !== "day" || state.dayStage !== "nomination") return;
    if (state.nominationPhase !== "voting") return;
    if (state.paused) return;
    const token = state.votingToken || 0;
    if (state && Array.isArray(state.players)) {
      state.players.forEach((player) => {
        if (player && !player.alive && player.deadVoteUsed && !state.nominationVotes[player.id]) {
          recordVote(player, "no", "\u9057\u8A00\u7968\u5DF2\u7528");
        }
      });
    }
    const human = state.players.find((p) => p.isHuman);
    if (human) {
      if (!human.alive && human.deadVoteUsed) {
        state.currentVoterId = "";
        state.humanVoted = true;
      } else {
        state.currentVoterId = human.id;
        startVoteCountdown(60);
      }
    } else {
      state.currentVoterId = "";
      state.humanVoted = true;
    }
    const aiVoters = state.players.filter(
      (p) => !p.isHuman && !(!p.alive && p.deadVoteUsed)
    );
    state.pendingAiVotes = aiVoters.length;
    if (!aiVoters.length) {
      state.pendingAiVotes = 0;
      maybeFinalizeVotes();
      return;
    }
    Promise.all(
      aiVoters.map(async (voter) => {
        if (!state || state.nominationPhase !== "voting" || state.votingToken !== token || state.paused) return;
        const result = await Promise.race([
          aiVoteSingle(voter),
          new Promise((resolve) => {
            setTimeout(() => resolve({ vote: "no", timeout: true }), 6e4);
          })
        ]);
        if (!state || state.nominationPhase !== "voting" || state.votingToken !== token || state.paused) return;
        recordVote(voter, result.vote, result.timeout ? "\u8D85\u65F6\u5F03\u7968" : "");
        state.pendingAiVotes = Math.max(0, state.pendingAiVotes - 1);
        maybeFinalizeVotes();
      })
    ).catch(() => {
    });
  }
  function maybeFinalizeVotes() {
    if (!state || state.phase !== "day" || state.dayStage !== "nomination") return;
    if (state.nominationPhase !== "voting") return;
    if (state.pendingAiVotes > 0) return;
    const human = state.players.find((p) => p.isHuman);
    if (human && !state.humanVoted) return;
    resolveNominationVotes();
  }
  async function finalizeDayExecution() {
    if (!state || !state.started) return;
    const aliveCount = state.players.filter((p) => p.alive).length;
    const executionThreshold = Math.ceil(aliveCount / 2);
    if (state.dayNominationCount === 0) {
      state.lastExecutedId = "";
      addChat("\u8BF4\u4E66\u4EBA", "\u65E0\u4EBA\u63D0\u540D\uFF0C\u8FDB\u5165\u591C\u665A\u3002", "storyteller");
      addLogEntry("\u65E0\u4EBA\u63D0\u540D", "day");
      addReplayEvent("\u65E0\u4EBA\u63D0\u540D\uFF0C\u8FDB\u5165\u591C\u665A", "day_action");
      addPublicLogEntry("\u65E0\u4EBA\u63D0\u540D\uFF0C\u8FDB\u5165\u591C\u665A");
    } else if (state.dayHighestNomineeId && !state.dayHighestTied && state.dayHighestVotes >= executionThreshold) {
      const nominee = state.players.find((p) => p.id === state.dayHighestNomineeId);
      if (nominee && nominee.alive) {
        nominee.alive = false;
        state.lastExecutedId = nominee.id;
        addChat("\u8BF4\u4E66\u4EBA", `${nominee.name} \u88AB\u5904\u51B3\u3002`, "storyteller");
        addLogEntry(`\u5904\u51B3\uFF1A${nominee.name}`, "day");
        addReplayEvent(`\u5904\u51B3\uFF1A${nominee.name}`, "day_action");
        addPublicLogEntry(`\u5904\u51B3\uFF1A${nominee.name}`);
        if (nominee.roleName === "\u5723\u5F92") {
          addChat("\u7CFB\u7EDF", "\u5723\u5F92\u88AB\u5904\u51B3\uFF0C\u90AA\u6076\u9635\u8425\u83B7\u80DC\u3002", "system");
          state.ended = true;
          state.winner = "evil";
          state.winCondition = "saint_executed";
        }
      }
    } else {
      state.lastExecutedId = "";
      const reason = state.dayHighestTied ? "\u6700\u9AD8\u7968\u5E73\u7968" : `\u6700\u9AD8\u7968\u4E0D\u8DB3\u534A\u6570\uFF08\u9700${executionThreshold}\u7968\uFF09`;
      addChat("\u8BF4\u4E66\u4EBA", `\u63D0\u540D\u7ED3\u675F\uFF0C${reason}\uFF0C\u65E0\u4EBA\u88AB\u5904\u51B3\u3002`, "storyteller");
      addLogEntry(`\u63D0\u540D\u7ED3\u675F\u65E0\u4EBA\u88AB\u5904\u51B3\uFF08${reason}\uFF09`, "day");
      addReplayEvent(`\u63D0\u540D\u7ED3\u675F\u65E0\u4EBA\u88AB\u5904\u51B3\uFF08${reason}\uFF09`, "day_action");
      addPublicLogEntry(`\u63D0\u540D\u7ED3\u675F\u65E0\u4EBA\u88AB\u5904\u51B3\uFF08${reason}\uFF09`);
    }
    renderAll();
    checkWin();
    if (state.ended) return;
    const alive = state.players.filter((p) => p.alive);
    const mayorAlive = alive.some((p) => p.roleName === "\u9547\u957F");
    if (mayorAlive && alive.length === 3 && !state.lastExecutedId) {
      addChat("\u7CFB\u7EDF", "\u9547\u957F\u89E6\u53D1\u80DC\u5229\u6761\u4EF6\uFF0C\u5584\u826F\u9635\u8425\u83B7\u80DC\u3002", "system");
      state.ended = true;
      state.winner = "good";
      state.winCondition = "mayor_win";
      renderAll();
      return;
    }
    switchPhase();
  }
  function recordVote(voter, vote, reason) {
    const value = vote === "yes" ? "yes" : "no";
    const safeReason = sanitizePublicReason(reason);
    state.nominationVotes[voter.id] = { vote: value, reason: safeReason };
    if (!voter.alive && value === "yes") {
      voter.deadVoteUsed = true;
    }
    const displaySuffix = reason && typeof reason === "string" && reason.includes("\u8D85\u65F6") ? `\uFF08${reason.trim()}\uFF09` : "";
    addChat("\u7CFB\u7EDF", `${voter.name} \u6295\u7968\uFF1A${value === "yes" ? "\u8D5E\u6210" : "\u53CD\u5BF9"}${displaySuffix}`, "system");
    addPublicLogEntry(`${voter.name} \u6295\u7968\uFF1A${value === "yes" ? "\u8D5E\u6210" : "\u53CD\u5BF9"}${displaySuffix}`);
  }
  function sanitizePublicReason(reason) {
    if (!reason || typeof reason !== "string") return "";
    let text = reason.trim();
    if (!text) return "";
    text = text.replace(/（[^）]*）/g, "").replace(/\([^)]*\)/g, "").replace(/【[^】]*】/g, "");
    const banned = ["\u5185\u5FC3", "\u5FC3\u91CC", "\u5FC3\u7406\u6D3B\u52A8", "\u601D\u8003\u8FC7\u7A0B", "\u4F5C\u4E3A\u6076\u9B54", "\u6211\u662F\u6076\u9B54", "\u6211\u662F\u722A\u7259", "\u6211\u662F\u574F\u4EBA", "\u6211\u662F\u90AA\u6076"];
    if (banned.some((key) => text.includes(key))) return "";
    return text.slice(0, 40);
  }
  async function aiVoteSingle(voter) {
    const nominee = state.players.find((p) => p.id === state.currentNomineeId);
    const recentChat = formatChatForPrompt(12, voter, "json");
    const privateInfo = formatPrivateInfoForPrompt(voter, "json", 4);
    const privateChatHistory = formatPlayerPrivateChats(voter);
    const evilChatHistory = formatEvilChatForPrompt(voter);
    if (!voter.alive && voter.deadVoteUsed) {
      return { vote: "no" };
    }
    const aliveDeadSummary = getAliveDeadSummary();
    const deadVoteNote = !voter.alive ? "\u4F60\u5DF2\u6B7B\u4EA1\uFF0C\u4F46\u4ECD\u6709\u4E00\u6B21\u9057\u8A00\u7968\uFF1A\u53EA\u6709\u6295\u8D5E\u6210\u624D\u4F1A\u751F\u6548\uFF0C\u6295\u53CD\u5BF9\u4E0D\u6D88\u8017\u3002" : "";
    const userContent = `\u516C\u5F00\u804A\u5929\uFF08\u6700\u8FD1\u589E\u91CF\uFF09\uFF1A
${recentChat}

        \u4F60\u7684\u79C1\u804A\u8BB0\u5F55\uFF1A
${privateChatHistory}
${evilChatHistory ? `
\u4F60\u7684\u90AA\u6076\u9635\u8425\u5BC6\u804A\u8BB0\u5F55\uFF1A
${evilChatHistory}
` : ""}
${aliveDeadSummary}
\u4F60\u7684\u5F53\u524D\u72B6\u6001\uFF1A${voter.alive ? "\u5B58\u6D3B" : "\u6B7B\u4EA1"}\u3002
${deadVoteNote}
\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\u589E\u91CF\uFF1A${privateInfo}
\u4F60\u9700\u8981\u5BF9\u63D0\u540D${nominee ? nominee.name : "\u67D0\u73A9\u5BB6"}\u6295\u7968\u3002\u82E5\u4F60\u5DF2\u77E5\u90AA\u6076\u961F\u53CB\uFF0C\u8BF7\u8C28\u614E\u6295\u4ED6\u4EEC\uFF0C\u9664\u975E\u6709\u660E\u786E\u727A\u7272/\u8F6C\u79FB\u89C6\u7EBF\u7684\u7406\u7531\u3002
\u8BF7\u8F93\u51FA JSON\uFF1A{"vote":"yes|no"}`;
    const prompt2 = buildPlayerPromptMessages(voter, "json", userContent, {
      systemPrompt: PLAYER_JSON_SYSTEM_PROMPT
    });
    try {
      const content = await callDeepSeek(prompt2, Number(tempInput.value) || 1, voter, "json");
      const json = extractJson(content);
      if (!json) return { vote: "no" };
      const vote = json.vote === "yes" ? "yes" : "no";
      return { vote };
    } catch (error) {
      return { vote: "no" };
    }
  }
  function resolveNominationVotes() {
    const aliveCount = state.players.filter((p) => p.alive).length;
    const alivePlayers = state.players.filter((p) => p.alive);
    alivePlayers.forEach((player) => {
      if (!state.nominationVotes[player.id]) {
        recordVote(player, "no", "\u672A\u6295\u9ED8\u8BA4\u53CD\u5BF9");
      }
    });
    let yesVotes = 0;
    const votingPlayers = state.players.filter(
      (p) => p.alive || !p.alive && p.deadVoteUsed
    );
    votingPlayers.forEach((player) => {
      let vote = state.nominationVotes[player.id]?.vote || "no";
      if (player.roleName === "\u7BA1\u5BB6" && !canButlerVote(player)) {
        vote = "no";
      }
      if (vote === "yes") yesVotes += 1;
    });
    const nominee = state.players.find((p) => p.id === state.currentNomineeId);
    addReplayEvent(`\u6295\u7968\u7ED3\u679C\uFF1A\u8D5E\u6210${yesVotes}/${aliveCount}`, "day_action");
    addPublicLogEntry(`\u6295\u7968\u7ED3\u679C\uFF1A\u8D5E\u6210${yesVotes}/${aliveCount}`);
    const pct = aliveCount > 0 ? Math.round(yesVotes / aliveCount * 100) : 0;
    const voteBarHtml = `<div class="vote-result-bar"><span>${nominee ? nominee.name : "?"}</span><div class="vote-bar-track"><div class="vote-bar-fill" style="width:${pct}%"></div></div><span class="vote-bar-label">${yesVotes}/${aliveCount} (${pct}%)</span></div>`;
    addChat("\u7CFB\u7EDF", voteBarHtml, "system");
    state.currentVoterId = "";
    state.nominationInProgress = false;
    state.nominationPhase = "open";
    state.nominationStep = "";
    state.voteCountdown = 0;
    state.humanVoted = false;
    state.pendingAiVotes = 0;
    clearVoteTimer();
    hideModal();
    if (nominee) {
      if (yesVotes > state.dayHighestVotes) {
        state.dayHighestVotes = yesVotes;
        state.dayHighestNomineeId = nominee.id;
        state.dayHighestTied = false;
        addPublicLogEntry(`\u5F53\u524D\u6700\u9AD8\u7968\uFF1A${nominee.name}\uFF08${yesVotes}\u7968\uFF09`);
      } else if (yesVotes === state.dayHighestVotes && yesVotes > 0) {
        state.dayHighestTied = true;
        state.dayHighestNomineeId = "";
        addPublicLogEntry(`\u51FA\u73B0\u5E73\u7968\uFF08${yesVotes}\u7968\uFF09\uFF0C\u6682\u65E0\u6CD5\u786E\u5B9A\u5904\u51B3\u8005`);
      } else if (state.dayHighestNomineeId) {
        const current = state.players.find((p) => p.id === state.dayHighestNomineeId);
        if (current) {
          addPublicLogEntry(`\u6700\u9AD8\u7968\u4ECD\u4E3A\uFF1A${current.name}\uFF08${state.dayHighestVotes}\u7968\uFF09`);
        }
      }
    }
    state.currentNomineeId = "";
    state.currentNominatorId = "";
    if (state.dayNominationCount >= MAX_NOMINATIONS_PER_DAY) {
      state.nominationPhase = "";
      state.nominationStep = "";
      state.currentSpeakerId = "";
      renderAll();
      finalizeDayExecution();
      return;
    }
    renderAll();
    maybeStartNextNomination();
  }
  async function runVote() {
    if (!state.started || state.phase !== "day" || state.dayStage !== "nomination") return;
    if (!state.currentNomineeId) {
      alert("\u8BF7\u5148\u5B8C\u6210\u63D0\u540D\u3002");
      return;
    }
    if (state.nominationPhase !== "voting") {
      startNominationVoting();
    }
  }

  // js/game-logic.js
  var playerCountInput2 = document.getElementById("playerCount");
  var humanNameInput2 = document.getElementById("humanName");
  var humanSeatInput2 = document.getElementById("humanSeat");
  var humanRoleSelect2 = document.getElementById("humanRoleSelect");
  var autoNightToggle2 = document.getElementById("autoNightToggle");
  var pauseBtn2 = document.getElementById("pauseBtn");
  var trajectoryToggle2 = document.getElementById("trajectoryToggle");
  var modelSelect2 = document.getElementById("modelSelect");
  var startBtn2 = document.getElementById("startBtn");
  var resolveNight;
  var startDiscussion;
  var getModelStartupReadiness2;
  var getDiscussionDurationSeconds2;
  function setResolveNight(fn) {
    resolveNight = fn;
  }
  function setStartDiscussion(fn) {
    startDiscussion = fn;
  }
  function setGetModelStartupReadiness(fn) {
    getModelStartupReadiness2 = fn;
  }
  function setGetDiscussionDurationSeconds(fn) {
    getDiscussionDurationSeconds2 = fn;
  }
  function setupPlayers() {
    const count = Math.max(5, Math.min(15, Number(playerCountInput2.value)));
    const humanSeat = Math.max(1, Math.min(count, Number(humanSeatInput2.value)));
    const players = Array.from({ length: count }, (_, index) => emptyPlayer(index));
    players[humanSeat - 1].name = humanNameInput2.value || "\u4F60";
    players[humanSeat - 1].isHuman = true;
    setState({
      players,
      started: false,
      ended: false,
      paused: false,
      pausedAt: 0,
      postGameChat: false,
      postGameInProgress: false,
      firstNightRecognitionDone: false,
      lastHumanChatAt: 0,
      storySummary: "",
      storySummaryPending: false,
      phase: "night",
      dayStage: "discussion",
      dayCount: 0,
      nightCount: 0,
      discussionRound: 0,
      maxDiscussionRounds: 3,
      discussionOrder: [],
      discussionCursor: 0,
      discussionPassed: [],
      currentSpeakerId: "",
      lastExecutedId: "",
      currentNomineeId: "",
      currentNominatorId: "",
      nominationPhase: "",
      nominationStep: "",
      nominationOrder: [],
      nominationCursor: 0,
      nominationVoteOrder: [],
      nominationVoteCursor: 0,
      currentVoterId: "",
      nominationVotes: {},
      nominationUsedIds: [],
      nomineeUsedIds: [],
      nominationInProgress: false,
      scarletTriggered: false,
      discussionToken: 0,
      discussionMaxRemaining: getDiscussionDurationSeconds2(),
      discussionDurationSeconds: getDiscussionDurationSeconds2(),
      voteCountdown: 0,
      pendingAiVotes: 0,
      humanVoted: false,
      votingToken: 0,
      dayNominationCount: 0,
      dayHighestVotes: 0,
      dayHighestNomineeId: "",
      dayHighestTied: false,
      pendingNominationQueue: [],
      pendingAiNominations: 0,
      humanNominationDone: false,
      publicLog: [],
      claims: {},
      claimHistory: [],
      recordTrajectories: false,
      trajectoryLog: [],
      privateChat: [],
      evilChat: [],
      winner: null,
      winCondition: null,
      replayEvents: [],
      infoAudit: [],
      lastInfoRegistrationMap: {},
      redHerringId: "",
      humanActionTarget: "",
      humanActionTarget2: "",
      humanActionConfirmed: false,
      lastDiscussionAt: 0,
      nominationCountdown: 0,
      chatSeq: 0,
      chat: [],
      chatFilter: "all",
      chatSearch: "",
      chatAutoFollow: true,
      chatUnreadCount: 0,
      chatLastReadSeq: 0,
      discussionTownDrawerOpen: false,
      discussionLogDrawerOpen: false,
      log: [],
      showRoles: false,
      lastDawnNarration: ""
    });
    if (trajectoryToggle2) {
      state.recordTrajectories = trajectoryToggle2.checked;
    }
    addChat("\u7CFB\u7EDF", "\u73A9\u5BB6\u5DF2\u751F\u6210\u3002\u8BF7\u968F\u673A\u53D1\u724C\u3002", "system");
    if (state) {
      renderAll();
    }
  }
  function adjustOutsiders(roles, lockedIds = /* @__PURE__ */ new Set()) {
    const pattern = /\[\s*([+-]\d+)\s*外来者\s*\]/g;
    let modifier = 0;
    roles.forEach((role) => {
      const matches = role.ability.matchAll(pattern);
      for (const match of matches) {
        modifier += Number(match[1]);
      }
    });
    if (modifier === 0) return roles;
    const list = roles.slice();
    const outsiders = SCRIPT.roles.filter((r) => r.team === "outsider" && !list.includes(r));
    const townsfolk = SCRIPT.roles.filter((r) => r.team === "townsfolk" && !list.includes(r));
    if (modifier > 0) {
      let add = modifier;
      while (add > 0 && outsiders.length) {
        const townIndex = list.findIndex((r) => r.team === "townsfolk" && !lockedIds.has(r.id));
        if (townIndex === -1) break;
        list.splice(townIndex, 1, outsiders.pop());
        add -= 1;
      }
    } else {
      let reduce = Math.abs(modifier);
      while (reduce > 0 && townsfolk.length) {
        const outIndex = list.findIndex((r) => r.team === "outsider" && !lockedIds.has(r.id));
        if (outIndex === -1) break;
        list.splice(outIndex, 1, townsfolk.pop());
        reduce -= 1;
      }
    }
    return list;
  }
  function assignRedHerring() {
    const hasFortuneTeller = state.players.some((p) => p.roleName === "\u5360\u535C\u5E08");
    if (!hasFortuneTeller) return "";
    const goodPlayers = state.players.filter(
      (p) => p.team === "townsfolk" && p.alive
    );
    if (!goodPlayers.length) return "";
    const choice = goodPlayers[Math.floor(Math.random() * goodPlayers.length)];
    return choice.id;
  }
  function assignDrunkAppearance() {
    const townsfolkRoles = SCRIPT.roles.filter((r) => r.team === "townsfolk");
    const inPlayRoleIds = new Set(state.players.map((p) => p.roleId));
    const notInPlayTownsfolk = townsfolkRoles.filter((r) => !inPlayRoleIds.has(r.id));
    state.players.forEach((player) => {
      const role = getRoleById(player.roleId);
      if (!role) return;
      if (role.name === "\u9152\u9B3C") {
        player.drunk = true;
        const pool = notInPlayTownsfolk.length ? notInPlayTownsfolk : townsfolkRoles;
        const fake = pool[Math.floor(Math.random() * pool.length)];
        player.apparentRoleId = fake.id;
        player.apparentRoleName = fake.name;
      } else {
        player.apparentRoleId = role.id;
        player.apparentRoleName = role.name;
      }
    });
  }
  function assignRoles() {
    if (!state || !state.players || !state.players.length) {
      alert('\u8BF7\u5148\u70B9\u51FB"\u751F\u6210\u73A9\u5BB6"\u3002');
      return;
    }
    const count = state.players.length;
    const dist = PLAYER_DISTRIBUTION[count];
    if (!dist) {
      alert("\u4EC5\u652F\u6301 5-15 \u4EBA\u3002");
      return;
    }
    const human = state.players.find((p) => p.isHuman);
    const selectedRoleId = humanRoleSelect2.value || "random";
    let lockedRole = null;
    if (selectedRoleId !== "random") {
      lockedRole = getRoleById(selectedRoleId);
      if (!lockedRole) {
        alert("\u672A\u627E\u5230\u8BE5\u89D2\u8272\u3002");
        return;
      }
      if (dist[lockedRole.team] <= 0) {
        alert("\u5F53\u524D\u4EBA\u6570\u914D\u7F6E\u4E0D\u5141\u8BB8\u8BE5\u9635\u8425\u89D2\u8272\u3002");
        return;
      }
    }
    const counts = {
      townsfolk: dist.townsfolk,
      outsider: dist.outsider,
      minion: dist.minion,
      demon: dist.demon
    };
    if (lockedRole) {
      counts[lockedRole.team] -= 1;
      if (counts[lockedRole.team] < 0) {
        alert("\u8BE5\u89D2\u8272\u4E0E\u5F53\u524D\u4EBA\u6570\u914D\u7F6E\u4E0D\u517C\u5BB9\u3002");
        return;
      }
    }
    const pool = {
      townsfolk: shuffle(SCRIPT.roles.filter((r) => r.team === "townsfolk" && r.id !== selectedRoleId)),
      outsider: shuffle(SCRIPT.roles.filter((r) => r.team === "outsider" && r.id !== selectedRoleId)),
      minion: shuffle(SCRIPT.roles.filter((r) => r.team === "minion" && r.id !== selectedRoleId)),
      demon: shuffle(SCRIPT.roles.filter((r) => r.team === "demon" && r.id !== selectedRoleId))
    };
    let picks = [];
    picks.push(...pool.townsfolk.slice(0, counts.townsfolk));
    picks.push(...pool.outsider.slice(0, counts.outsider));
    picks.push(...pool.minion.slice(0, counts.minion));
    picks.push(...pool.demon.slice(0, counts.demon));
    if (lockedRole) {
      picks.push(lockedRole);
    }
    const lockedIds = lockedRole ? /* @__PURE__ */ new Set([lockedRole.id]) : /* @__PURE__ */ new Set();
    picks = adjustOutsiders(picks, lockedIds);
    const shuffled = shuffle(picks);
    const assignRoleToSeat = (seatIndex, role) => {
      state.players[seatIndex].roleId = role.id;
      state.players[seatIndex].roleName = role.name;
      state.players[seatIndex].team = role.team;
      state.players[seatIndex].alive = true;
      state.players[seatIndex].privateInfo = [];
      state.players[seatIndex].memory = [];
      state.players[seatIndex].drunk = false;
      state.players[seatIndex].poisoned = false;
      state.players[seatIndex].poisonedUntilDay = 0;
      state.players[seatIndex].protected = false;
      state.players[seatIndex].virginUsed = false;
      state.players[seatIndex].slayerUsed = false;
      state.players[seatIndex].butlerMasterId = "";
      state.players[seatIndex].deadVoteUsed = false;
      state.players[seatIndex].roleHistory = [{
        roleName: role.name,
        phase: "\u521D\u59CB",
        night: 0,
        day: 0,
        reason: "\u521D\u59CB\u5206\u914D"
      }];
    };
    if (lockedRole && human) {
      const roleIndex = shuffled.findIndex((r) => r.id === lockedRole.id);
      if (roleIndex !== -1) {
        shuffled.splice(roleIndex, 1);
      }
      const seats = shuffle(state.players.map((_, i) => i).filter((i) => !state.players[i].isHuman));
      seats.forEach((seatIndex, roleIndex2) => {
        const role = shuffled[roleIndex2];
        if (role) assignRoleToSeat(seatIndex, role);
      });
      const humanIndex = state.players.findIndex((p) => p.isHuman);
      if (humanIndex !== -1) {
        assignRoleToSeat(humanIndex, lockedRole);
      }
    } else {
      const seats = shuffle(state.players.map((_, i) => i));
      seats.forEach((seatIndex, roleIndex) => {
        const role = shuffled[roleIndex];
        if (role) assignRoleToSeat(seatIndex, role);
      });
    }
    assignDrunkAppearance();
    state.redHerringId = assignRedHerring();
    addChat("\u7CFB\u7EDF", "\u968F\u673A\u53D1\u724C\u5B8C\u6210\u3002", "system");
    renderAll();
  }
  async function startGame() {
    if (!state) return;
    if (!state.players.some((p) => p.roleId)) {
      alert("\u8BF7\u5148\u968F\u673A\u53D1\u724C\u3002");
      return;
    }
    const modelReady = getModelStartupReadiness2();
    if (!modelReady.ok) {
      alert(modelReady.message);
      return;
    }
    const originalStartLabel = startBtn2 ? startBtn2.textContent : "";
    if (startBtn2) {
      startBtn2.disabled = true;
      startBtn2.textContent = "\u68C0\u6D4B\u6A21\u578B...";
    }
    try {
      const probe = await probeGameStartConnections();
      if (!probe.ok) {
        alert(probe.message);
        return;
      }
    } finally {
      if (startBtn2) {
        startBtn2.disabled = false;
        startBtn2.textContent = originalStartLabel || "\u5F00\u5C40";
      }
    }
    state.started = true;
    state.ended = false;
    state.paused = false;
    state.phase = "night";
    state.dayCount = 0;
    state.nightCount = 1;
    state.firstNightRecognitionDone = false;
    state.discussionRound = 0;
    state.dayStage = "discussion";
    state.discussionOrder = [];
    state.discussionCursor = 0;
    state.discussionPassed = [];
    state.currentSpeakerId = "";
    state.currentNomineeId = "";
    state.currentNominatorId = "";
    state.nominationPhase = "";
    state.nominationStep = "";
    state.nominationOrder = [];
    state.nominationCursor = 0;
    state.nominationVoteOrder = [];
    state.nominationVoteCursor = 0;
    state.currentVoterId = "";
    state.nominationVotes = {};
    state.nominationUsedIds = [];
    state.nomineeUsedIds = [];
    state.lastDiscussionAt = 0;
    state.nominationCountdown = 0;
    state.voteCountdown = 0;
    state.pendingAiVotes = 0;
    state.humanVoted = false;
    state.votingToken = (state.votingToken || 0) + 1;
    state.players.forEach((player) => {
      player.publicChatCursorBySession = {};
      player.privateInfoCursorBySession = {};
      player.messageSessions = {};
    });
    addChat("\u7CFB\u7EDF", "\u6E38\u620F\u5F00\u59CB\u3002", "system");
    addLogEntry("\u5F00\u5C40", "system");
    if (!state.firstNightRecognitionDone) {
      recordFirstNightRecognition();
    }
    addChat("\u8BF4\u4E66\u4EBA", `\u591C\u5E55\u964D\u4E34\uFF08\u591C\u665A${state.nightCount}\uFF09\u3002`, "storyteller");
    addChat("\u7CFB\u7EDF", "\u8BF7\u7B49\u5F85\u8BF4\u4E66\u4EBA\u5BA3\u5E03\u5929\u4EAE\u3002", "system");
    renderAll();
    scheduleAutoNight();
  }
  function endGame() {
    if (!state) return;
    state.ended = true;
    state.paused = false;
    clearNominationTimers();
    clearVoteTimer();
    clearDayDiscussionTimer();
    addLogEntry("\u6E38\u620F\u7ED3\u675F", "system");
    enablePostGameChat();
  }
  function enablePostGameChat() {
    if (!state || !state.ended) return;
    if (state.postGameChat) {
      renderAll();
      return;
    }
    state.postGameChat = true;
    state.postGameInProgress = false;
    addChat("\u7CFB\u7EDF", `\u6E38\u620F\u5DF2\u7ED3\u675F\uFF0C\u8FDB\u5165\u8D5B\u540E\u804A\u5929\u3002\u4F60\u53EF\u4EE5\u7EE7\u7EED\u53D1\u8A00\u6216\u70B9\u51FB"AI\u8F6E\u8F6C"\u3002`, "system");
    renderAll();
  }
  function checkWin() {
    const alive = state.players.filter((p) => p.alive);
    let demonAlive = alive.some((p) => p.team === "demon");
    if (!demonAlive) {
      const scarlet = alive.find((p) => p.roleName === "\u7EA2\u5507\u5973\u90CE");
      if (scarlet && alive.length >= 5) {
        const demonRole = SCRIPT.roles.find((r) => r.team === "demon");
        scarlet.team = "demon";
        scarlet.roleId = demonRole.id;
        scarlet.roleName = demonRole.name;
        scarlet.apparentRoleId = demonRole.id;
        scarlet.apparentRoleName = demonRole.name;
        setPrivateInfo(scarlet, "\u4F60\u5DF2\u7EE7\u4EFB\u4E3A\u6076\u9B54\u3002");
        recordRoleChange(scarlet, demonRole.name, "\u7EA2\u5507\u5973\u90CE\u7EE7\u4EFB");
        if (!state.scarletTriggered) {
          const deadDemon = state.players.find((p) => p.team === "demon" && !p.alive);
          if (deadDemon) {
            addChat("\u8BF4\u4E66\u4EBA", `${deadDemon.name} \u6B7B\u4EA1\uFF0C\u4F46\u6E38\u620F\u5E76\u672A\u7ED3\u675F\u3002`, "storyteller");
          } else {
            addChat("\u8BF4\u4E66\u4EBA", "\u6076\u9B54\u6B7B\u4EA1\uFF0C\u4F46\u6E38\u620F\u5E76\u672A\u7ED3\u675F\u3002", "storyteller");
          }
          state.scarletTriggered = true;
        }
        demonAlive = true;
      }
    }
    if (!demonAlive) {
      addChat("\u7CFB\u7EDF", "\u5584\u826F\u9635\u8425\u83B7\u80DC\uFF08\u6076\u9B54\u6B7B\u4EA1\uFF09\u3002", "system");
      state.ended = true;
      state.winner = "good";
      state.winCondition = "demon_killed";
    } else if (alive.length <= 2) {
      addChat("\u7CFB\u7EDF", "\u90AA\u6076\u9635\u8425\u83B7\u80DC\uFF08\u5B58\u6D3B\u4EC5\u5269\u4E24\u4EBA\uFF09\u3002", "system");
      state.ended = true;
      state.winner = "evil";
      state.winCondition = "two_alive";
    }
    if (state.ended) {
      enablePostGameChat();
      return;
    }
    renderAll();
  }
  function switchPhase() {
    if (!state.started || state.ended) return;
    clearAutoNightTimer();
    clearNominationTimers();
    clearVoteTimer();
    hideModal();
    if (state.phase === "night") {
      state.phase = "day";
      state.dayCount += 1;
      addLogEntry(`\u8FDB\u5165\u767D\u5929${state.dayCount}`, "phase");
      addChat("\u8BF4\u4E66\u4EBA", `\u5929\u4EAE\u4E86\uFF08\u767D\u5929${state.dayCount}\uFF09\u3002`, "storyteller");
      addReplayEvent(`\u8FDB\u5165\u767D\u5929${state.dayCount}`, "day_phase");
      if (state.lastDawnNarration) {
        showDawnNarration(state.lastDawnNarration);
        state.lastDawnNarration = "";
      } else {
        showDawnNarration("\u5929\u4EAE\u4E86\u3002");
      }
      startDiscussion(true);
    } else {
      state.phase = "night";
      state.nightCount += 1;
      state.humanActionTarget = "";
      state.humanActionTarget2 = "";
      state.humanActionConfirmed = false;
      state.dayStage = "discussion";
      addLogEntry(`\u8FDB\u5165\u591C\u665A${state.nightCount}`, "phase");
      addChat("\u8BF4\u4E66\u4EBA", `\u591C\u5E55\u964D\u4E34\uFF08\u591C\u665A${state.nightCount}\uFF09\u3002`, "storyteller");
      addChat("\u7CFB\u7EDF", "\u8BF7\u7B49\u5F85\u8BF4\u4E66\u4EBA\u5BA3\u5E03\u5929\u4EAE\u3002", "system");
    }
    renderAll();
    if (state.phase === "night") {
      compressDaySessions().then(() => {
        scheduleAutoNight();
      });
    }
  }
  function scheduleAutoNight() {
    clearAutoNightTimer();
    if (!state || !state.started || state.ended || state.paused) return;
    if (state.phase !== "night") return;
    if (!autoNightToggle2.checked) return;
    if (needsHumanNightAction() && !isHumanActionReady()) return;
    setAutoNightTimer(setTimeout(() => {
      setAutoNightTimer(null);
      resolveNight();
    }, 600));
  }
  function clearAutoNightTimer() {
    if (autoNightTimer) {
      clearTimeout(autoNightTimer);
      setAutoNightTimer(null);
    }
  }
  function clearDayDiscussionTimer() {
    if (dayDiscussionTimer) {
      clearInterval(dayDiscussionTimer);
      setDayDiscussionTimer(null);
    }
  }
  function startDayDiscussionTimer(reset = false) {
    clearDayDiscussionTimer();
    if (!state || !state.started || state.ended || state.paused) return;
    if (state.phase !== "day" || state.dayStage !== "discussion") return;
    if (reset || typeof state.discussionMaxRemaining !== "number" || !Number.isFinite(state.discussionMaxRemaining) || state.discussionMaxRemaining <= 0) {
      const duration = getDiscussionDurationSeconds2();
      state.discussionDurationSeconds = duration;
      state.discussionMaxRemaining = duration;
    }
    renderStatus();
    setDayDiscussionTimer(setInterval(() => {
      if (!state || state.ended || state.phase !== "day" || state.dayStage !== "discussion") {
        clearDayDiscussionTimer();
        return;
      }
      if (state.paused) {
        clearDayDiscussionTimer();
        return;
      }
      state.discussionMaxRemaining -= 1;
      if (state.discussionMaxRemaining <= 0) {
        clearDayDiscussionTimer();
        addChat("\u7CFB\u7EDF", "\u8BA8\u8BBA\u65F6\u95F4\u7ED3\u675F\uFF0C\u8FDB\u5165\u63D0\u540D\u9636\u6BB5\u3002", "system");
        enterNomination();
        return;
      }
      renderStatus();
    }, 1e3));
  }
  function needsHumanNightAction() {
    if (!state || !state.started) return false;
    const human = state.players.find((p) => p.isHuman && p.alive);
    if (!human) return false;
    const role = getApparentRole(human);
    if (!role) return false;
    if (role.name === "\u50E7\u4FA3" && state.nightCount === 1) return false;
    if (role.name === "\u5C0F\u6076\u9B54" && state.nightCount === 1) return false;
    if (["\u50E7\u4FA3", "\u6295\u6BD2\u8005", "\u5C0F\u6076\u9B54", "\u7BA1\u5BB6"].includes(role.name)) return true;
    if (role.name === "\u5360\u535C\u5E08") return true;
    return false;
  }
  function isHumanActionReady() {
    if (!state || !state.started) return true;
    const human = state.players.find((p) => p.isHuman && p.alive);
    if (!human) return true;
    const role = getApparentRole(human);
    if (!role) return true;
    if (role.name === "\u50E7\u4FA3" && state.nightCount === 1) return true;
    if (role.name === "\u5C0F\u6076\u9B54" && state.nightCount === 1) return true;
    if (role.name === "\u5C0F\u6076\u9B54") {
      return Boolean(state.humanActionTarget && state.humanActionConfirmed);
    }
    if (["\u50E7\u4FA3", "\u6295\u6BD2\u8005", "\u5C0F\u6076\u9B54", "\u7BA1\u5BB6"].includes(role.name)) {
      return Boolean(state.humanActionTarget && state.humanActionConfirmed);
    }
    if (role.name === "\u5360\u535C\u5E08") {
      return Boolean(state.humanActionTarget && state.humanActionTarget2 && state.humanActionConfirmed);
    }
    return true;
  }
  function togglePause() {
    if (!state || !state.started || state.ended) return;
    state.paused = !state.paused;
    if (state.paused) {
      state.pausedAt = Date.now();
      clearAutoNightTimer();
      clearNominationTimers();
      clearVoteTimer();
      clearDayDiscussionTimer();
      addChat("\u7CFB\u7EDF", "\u6E38\u620F\u5DF2\u6682\u505C\u3002", "system");
    } else {
      if (state.phase === "day" && state.dayStage === "discussion") {
        state.lastDiscussionAt = Date.now();
      }
      state.pausedAt = 0;
      addChat("\u7CFB\u7EDF", "\u6E38\u620F\u7EE7\u7EED\u3002", "system");
      scheduleAutoNight();
      scheduleNominationTimeout();
      startDayDiscussionTimer(false);
    }
    updatePauseButton2();
    if (state) {
      renderAll();
    }
  }
  function updatePauseButton2() {
    if (!pauseBtn2) return;
    pauseBtn2.textContent = state && state.paused ? "\u7EE7\u7EED" : "\u6682\u505C";
    pauseBtn2.disabled = !state || !state.started || state.ended;
  }

  // js/night-actions.js
  function getTempValue() {
    const el = document.getElementById("tempInput");
    return el ? Number(el.value) || 1 : 1;
  }
  function normalizeTargetName2(name) {
    if (!name) return "";
    return String(name).replace(/\(真人\)/g, "").replace(/（已死亡）/g, "").trim();
  }
  function resolveTargetByName(name, candidates, actor) {
    if (!name || !candidates.length) return null;
    const normalized = normalizeTargetName2(name);
    if (normalized === "\u81EA\u5DF1" || normalized === "\u6211" || normalized === "\u6211\u81EA\u5DF1") {
      return actor && candidates.find((p) => p.id === actor.id) ? actor : null;
    }
    return candidates.find((p) => p.name === normalized) || null;
  }
  function storytellerTruthBias(player) {
    const goodAlive = state.players.filter((p) => p.alive && p.team !== "minion" && p.team !== "demon").length;
    const evilAlive = state.players.filter((p) => p.alive && (p.team === "minion" || p.team === "demon")).length;
    const advantage = evilAlive - goodAlive;
    let chance = 0.5;
    if (player.team === "townsfolk" || player.team === "outsider") {
      chance += advantage > 0 ? 0.2 : -0.2;
    } else {
      chance += advantage > 0 ? -0.2 : 0.2;
    }
    return Math.random() < Math.min(0.8, Math.max(0.2, chance));
  }
  function getAliveNeighbors(index) {
    const total = state.players.length;
    if (!total) return [];
    const aliveIndices = state.players.map((p, i) => p.alive ? i : -1).filter((i) => i !== -1);
    if (aliveIndices.length <= 2) return aliveIndices.map((i) => state.players[i]);
    const pos = aliveIndices.indexOf(index);
    if (pos === -1) return [];
    const left = aliveIndices[(pos - 1 + aliveIndices.length) % aliveIndices.length];
    const right = aliveIndices[(pos + 1) % aliveIndices.length];
    return [state.players[left], state.players[right]];
  }
  async function aiChooseSingleTarget(actor, candidates, actionLabel, extraNote = "") {
    if (!actor || !candidates.length) return null;
    const privateInfo = formatPrivateInfoForPrompt(actor, "json", 4);
    const privateChatHistory = formatPlayerPrivateChats(actor);
    const recentChat = formatChatForPrompt(12, actor, "json");
    const aliveDeadSummary = getAliveDeadSummary();
    const targetNames = candidates.map((p) => playerOptionLabel(p)).join("\u3001");
    const userContent = `\u516C\u5F00\u804A\u5929\uFF08\u6700\u8FD1\u589E\u91CF\uFF09\uFF1A
${recentChat}

        \u4F60\u7684\u79C1\u804A\u8BB0\u5F55\uFF1A
${privateChatHistory}

${aliveDeadSummary}
\u4F60\u7684\u5F53\u524D\u72B6\u6001\uFF1A${actor.alive ? "\u5B58\u6D3B" : "\u6B7B\u4EA1"}\u3002
\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\u589E\u91CF\uFF1A${privateInfo}
\u73B0\u5728\u662F\u591C\u665A\uFF0C\u4F60\u9700\u8981\u6267\u884C\u884C\u52A8\uFF1A${actionLabel}\u3002
\u53EF\u9009\u76EE\u6807\uFF1A${targetNames}\u3002\u53EA\u80FD\u4ECE\u5217\u8868\u4E2D\u9009\u62E9\u4E00\u4E2A\u76EE\u6807\u3002${extraNote || ""}
\u8BF7\u8F93\u51FA JSON\uFF1A{"target":"\u73A9\u5BB6\u540D"}`;
    const prompt2 = buildPlayerPromptMessages(actor, "json", userContent, {
      systemPrompt: PLAYER_JSON_SYSTEM_PROMPT
    });
    try {
      const content = await callDeepSeek(prompt2, getTempValue(), actor, "json");
      const json = extractJson(content);
      const target = json ? resolveTargetByName(json.target, candidates, actor) : null;
      return target || null;
    } catch (error) {
      return null;
    }
  }
  async function aiChooseTwoTargets(actor, candidates, actionLabel) {
    if (!actor || candidates.length < 2) return candidates;
    const privateInfo = formatPrivateInfoForPrompt(actor, "json", 4);
    const privateChatHistory = formatPlayerPrivateChats(actor);
    const recentChat = formatChatForPrompt(12, actor, "json");
    const aliveDeadSummary = getAliveDeadSummary();
    const targetNames = candidates.map((p) => playerOptionLabel(p)).join("\u3001");
    const userContent = `\u516C\u5F00\u804A\u5929\uFF08\u6700\u8FD1\u589E\u91CF\uFF09\uFF1A
${recentChat}

        \u4F60\u7684\u79C1\u804A\u8BB0\u5F55\uFF1A
${privateChatHistory}

${aliveDeadSummary}
\u4F60\u7684\u5F53\u524D\u72B6\u6001\uFF1A${actor.alive ? "\u5B58\u6D3B" : "\u6B7B\u4EA1"}\u3002
\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\u589E\u91CF\uFF1A${privateInfo}
\u73B0\u5728\u662F\u591C\u665A\uFF0C\u4F60\u9700\u8981\u6267\u884C\u884C\u52A8\uFF1A${actionLabel}\u3002
\u53EF\u9009\u76EE\u6807\uFF1A${targetNames}\u3002\u53EA\u80FD\u4ECE\u5217\u8868\u4E2D\u9009\u62E9\u4E24\u540D\u4E0D\u540C\u76EE\u6807\u3002
\u8BF7\u8F93\u51FA JSON\uFF1A{"target1":"\u73A9\u5BB6\u540D","target2":"\u73A9\u5BB6\u540D"}`;
    const prompt2 = buildPlayerPromptMessages(actor, "json", userContent, {
      systemPrompt: PLAYER_JSON_SYSTEM_PROMPT
    });
    try {
      const content = await callDeepSeek(prompt2, getTempValue(), actor, "json");
      const json = extractJson(content);
      const t1 = json ? resolveTargetByName(json.target1, candidates, actor) : null;
      const t2 = json ? resolveTargetByName(json.target2, candidates, actor) : null;
      if (t1 && t2 && t1.id !== t2.id) {
        return [t1, t2];
      }
    } catch (error) {
      return candidates.slice(0, 2);
    }
    return candidates.slice(0, 2);
  }
  function getDayRuleNote() {
    if (!state || !state.started) return "";
    const notes = [];
    if (state.phase === "day" && state.dayCount === 1) {
      notes.push("\u9996\u591C\u6CA1\u6709\u6076\u9B54\u51FB\u6740\uFF0C\u767D\u59291\u65E0\u4EBA\u6B7B\u4EA1\u662F\u5E38\u89C4\u89C4\u5219\uFF0C\u4E0D\u8981\u5C06\u5176\u5F53\u4F5C\u7EBF\u7D22\u3002");
    }
    if (state.phase === "day" && state.dayStage === "discussion" && !state.ended) {
      notes.push(`\u730E\u624B\u58F0\u660E\u683C\u5F0F\uFF1A${SLAYER_DECLARATION_TEMPLATE}\uFF1B\u4E0D\u7B26\u5408\u683C\u5F0F\u4E0D\u4F1A\u89E6\u53D1\u5F00\u67AA\u3002`);
    }
    return notes.join(" ");
  }
  function isDroisoned(player) {
    return player.drunk || player.poisoned;
  }
  var TEAM_LABEL2 = { townsfolk: "\u9547\u6C11", outsider: "\u5916\u6765\u8005", minion: "\u722A\u7259", demon: "\u6076\u9B54" };
  function getSeatingSummary() {
    return state.players.map(
      (p, i) => `\u5EA7\u4F4D${i + 1}: ${p.name}\uFF08${p.alive ? "\u5B58\u6D3B" : "\u6B7B\u4EA1"}\uFF09`
    ).join(" \u2192 ") + " \u2192 [\u56DE\u5230\u5EA7\u4F4D1]";
  }
  function getGrimoireSummary() {
    const isEvil = (t) => t === "minion" || t === "demon";
    return state.players.map((p, i) => {
      let s = `\u5EA7\u4F4D${i + 1} ${p.name}: \u89D2\u8272=${p.roleName}, \u89D2\u8272\u7C7B\u578B=${TEAM_LABEL2[p.team] || p.team}, \u9635\u8425=${isEvil(p.team) ? "\u90AA\u6076" : "\u5584\u826F"}, ${p.alive ? "\u5B58\u6D3B" : "\u6B7B\u4EA1"}`;
      if (p.drunk) s += `, \u9189\u9152\uFF08\u81EA\u4EE5\u4E3A\u662F${p.apparentRoleName || "\u672A\u77E5"}\uFF09`;
      if (p.poisoned) s += ", \u4E2D\u6BD2";
      return s;
    }).join("\n");
  }
  function getDemonSummaries() {
    const demon = state.players.find((p) => p.alive && p.team === "demon");
    if (!demon) return "";
    const session = demon.messageSessions && demon.messageSessions["chat"] || [];
    const summaries = session.filter((msg) => msg.role === "system" && typeof msg.content === "string" && msg.content.startsWith("[\u767D\u5929")).map((msg) => msg.content);
    return summaries.length ? summaries.join("\n\n") : "";
  }
  function generateRandomFalseInfo(label, trueInfo) {
    const players = state.players;
    switch (label) {
      case "\u53A8\u5E08\u4FE1\u606F": {
        const options = ["0 \u5BF9\u76F8\u90BB\u90AA\u6076\u73A9\u5BB6", "1 \u5BF9\u76F8\u90BB\u90AA\u6076\u73A9\u5BB6", "2 \u5BF9\u76F8\u90BB\u90AA\u6076\u73A9\u5BB6"].filter((o) => o !== trueInfo);
        return options[Math.floor(Math.random() * options.length)] || trueInfo;
      }
      case "\u5171\u60C5\u8005\u4FE1\u606F": {
        const options = ["0", "1", "2"].filter((o) => o !== trueInfo);
        return options[Math.floor(Math.random() * options.length)] || trueInfo;
      }
      case "\u5360\u535C\u5E08\u4FE1\u606F":
        return trueInfo === "\u6709\u6076\u9B54" ? "\u6CA1\u6709\u6076\u9B54" : "\u6709\u6076\u9B54";
      case "\u6D17\u8863\u5987\u4FE1\u606F": {
        const townsfolkRoles = SCRIPT.roles.filter((r) => r.team === "townsfolk");
        const townsfolkInPlay = players.filter((p) => p.team === "townsfolk");
        const fakeRole = townsfolkRoles.find((r) => !townsfolkInPlay.some((p) => p.roleId === r.id));
        const fakePlayers = shuffle(players.slice()).slice(0, 2);
        if (fakeRole && fakePlayers.length >= 2) return `${fakePlayers[0].name} \u6216 ${fakePlayers[1].name} \u662F ${fakeRole.name}`;
        return trueInfo;
      }
      case "\u56FE\u4E66\u7BA1\u7406\u5458\u4FE1\u606F": {
        const outsiderRoles = SCRIPT.roles.filter((r) => r.team === "outsider");
        if (!outsiderRoles.length) return trueInfo;
        const fakeRole = outsiderRoles[Math.floor(Math.random() * outsiderRoles.length)];
        const fakePlayers = shuffle(players.slice()).slice(0, 2);
        if (fakePlayers.length >= 2) return `${fakePlayers[0].name} \u6216 ${fakePlayers[1].name} \u662F ${fakeRole.name}`;
        return trueInfo;
      }
      case "\u8C03\u67E5\u5458\u4FE1\u606F": {
        const minionRoles = SCRIPT.roles.filter((r) => r.team === "minion");
        if (!minionRoles.length) return trueInfo;
        const fakeRole = minionRoles[Math.floor(Math.random() * minionRoles.length)];
        const fakePlayers = shuffle(players.slice()).slice(0, 2);
        if (fakePlayers.length >= 2) return `${fakePlayers[0].name} \u6216 ${fakePlayers[1].name} \u662F ${fakeRole.name}`;
        return trueInfo;
      }
      case "\u9001\u846C\u8005\u4FE1\u606F":
      case "\u5B88\u9E26\u4EBA\u4FE1\u606F": {
        const roleNames = SCRIPT.roles.map((r) => r.name);
        const others = roleNames.filter((n) => n !== trueInfo);
        return others[Math.floor(Math.random() * others.length)] || trueInfo;
      }
      default:
        return trueInfo;
    }
  }
  function getStorytellerBalanceSummary() {
    const aliveGood = state.players.filter((p) => p.alive && p.team !== "minion" && p.team !== "demon").length;
    const aliveEvil = state.players.filter((p) => p.alive && (p.team === "minion" || p.team === "demon")).length;
    const deadGood = state.players.filter((p) => !p.alive && p.team !== "minion" && p.team !== "demon").length;
    const deadEvil = state.players.filter((p) => !p.alive && (p.team === "minion" || p.team === "demon")).length;
    const advantage = aliveEvil - aliveGood;
    const advantageText = advantage > 1 ? "\u90AA\u6076\u660E\u663E\u4F18\u52BF" : advantage === 1 ? "\u90AA\u6076\u5C0F\u4F18\u52BF" : advantage === 0 ? "\u5747\u52BF" : advantage === -1 ? "\u5584\u826F\u5C0F\u4F18\u52BF" : "\u5584\u826F\u660E\u663E\u4F18\u52BF";
    return `\u5B58\u6D3B\u5584\u826F ${aliveGood} / \u5B58\u6D3B\u90AA\u6076 ${aliveEvil}\uFF08${advantageText}\uFF09\uFF1B\u6B7B\u4EA1\u5584\u826F ${deadGood} / \u6B7B\u4EA1\u90AA\u6076 ${deadEvil}`;
  }
  function getClaimsSummary(limit = 8) {
    if (!state || !state.claims) return "\u65E0";
    const claims = Object.values(state.claims);
    if (!claims.length) return "\u65E0";
    const sorted = claims.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
    const slice = sorted.slice(-limit);
    return slice.map((entry) => `${entry.playerName}\u81EA\u79F0${entry.roleName}`).join("\uFF1B");
  }
  function getRelatedClaimsSummary(names) {
    if (!state || !state.claims || !Array.isArray(names) || !names.length) return "\u65E0";
    const entries = Object.values(state.claims).filter((entry) => names.includes(entry.playerName));
    if (!entries.length) return "\u65E0";
    return entries.map((entry) => `${entry.playerName}\u81EA\u79F0${entry.roleName}`).join("\uFF1B");
  }
  function getClaimRoleByPlayerName(playerName) {
    if (!state || !state.claims || !playerName) return "";
    const entry = Object.values(state.claims).find((item) => item.playerName === playerName);
    return entry && entry.roleName ? entry.roleName : "";
  }
  function getRelatedPlayerTruthSummary(names) {
    if (!state || !Array.isArray(names) || !names.length) return "\u65E0";
    const parts = names.map((name) => {
      const player = state.players.find((p) => p.name === name);
      if (!player) return `${name}: \u672A\u627E\u5230`;
      const claim = getClaimRoleByPlayerName(name) || "\u65E0";
      return `${name}: \u9635\u8425=${player.team}, \u771F\u5B9E\u89D2\u8272=${player.roleName}, \u516C\u804A\u8D77\u8DF3=${claim}`;
    });
    return parts.length ? parts.join("\uFF1B") : "\u65E0";
  }
  async function storytellerChooseInfo(player, label, trueInfo, fallbackOptions, context = null) {
    const balanceSummary = getStorytellerBalanceSummary();
    const relatedNames = context && Array.isArray(context.relatedNames) ? context.relatedNames : [];
    const claimsSummary = getClaimsSummary(10);
    const relatedClaims = relatedNames.length ? getRelatedClaimsSummary(relatedNames) : "\u65E0";
    const relatedTruth = relatedNames.length ? getRelatedPlayerTruthSummary(relatedNames) : "\u65E0";
    const formatHint = INFO_FORMAT_HINTS[label] || "\u8BF7\u6309\u8BE5\u4FE1\u606F\u7C7B\u578B\u7684\u5E38\u89C4\u683C\u5F0F\u8F93\u51FA\u3002";
    const playerNames = state.players.map((p) => p.name);
    const demonSummaries = getDemonSummaries();
    const instructionParts = [
      "\u4F60\u662F\u300A\u8840\u67D3\u949F\u697C\xB7\u6697\u6D41\u6D8C\u52A8\u300B\u7684\u8BF4\u4E66\u4EBA\u3002",
      `\u300A\u8840\u67D3\u949F\u697C\xB7\u6697\u6D41\u6D8C\u52A8\u300B\u662F\u4E00\u6B3E\u8FDB\u9636\u7248\u793E\u4EA4\u63A8\u7406\u6E38\u620F\uFF0C\u53EF\u7406\u89E3\u4E3A"\u6BCF\u4E2A\u4EBA\u90FD\u6709\u72EC\u7279\u8D85\u80FD\u529B\u7684\u72FC\u4EBA\u6740"\u3002`,
      `\u6838\u5FC3\u673A\u5236\u662F"\u6B7B\u800C\u4E0D\u50F5"\u548C"\u4FE1\u606F\u8FF7\u96FE"\uFF1A\u6B7B\u4EBA\u4ECD\u53EF\u53C2\u4E0E\u8BA8\u8BBA\u4E14\u62E5\u6709\u4E00\u7968\u6B7B\u4EBA\u7968\uFF1B\u9189\u9152\u4E0E\u4E2D\u6BD2\u4F1A\u8BA9\u6280\u80FD\u4E00\u5B9A\u5931\u6548\uFF0C\u4FE1\u606F\u5219\u53EF\u80FD\u9519\u8BEF\uFF0C\u9700\u8981\u903B\u8F91\u9A8C\u8BC1\u3002`,
      "\u6E38\u620F\u5206\u4E3A\u5584\u826F\u4E0E\u90AA\u6076\u9635\u8425\u3002\u9547\u6C11\u548C\u5916\u6765\u8005\u5C5E\u4E8E\u5584\u826F\u9635\u8425\uFF0C\u722A\u7259\u548C\u6076\u9B54\u5C5E\u4E8E\u90AA\u6076\u9635\u8425\u3002\u5584\u826F\u9635\u8425\u7684\u83B7\u80DC\u6761\u4EF6\u662F\u5904\u51B3\u6076\u9B54\uFF0C\u6216\u89E6\u53D1\u5584\u826F\u9635\u8425\u7279\u6B8A\u7684\u80DC\u5229\u673A\u5236\uFF08\u5982\u9547\u957F\u65E5\uFF09\uFF1B\u90AA\u6076\u9635\u8425\u7684\u83B7\u80DC\u6761\u4EF6\u662F\u8BA9\u573A\u4E0A\u4EC5\u5269\u4E24\u540D\u5B58\u6D3B\u73A9\u5BB6\u4E14\u6076\u9B54\u5B58\u6D3B\uFF0C\u6216\u89E6\u53D1\u5584\u826F\u9635\u8425\u7279\u6B8A\u7684\u5931\u8D25\u673A\u5236\uFF08\u6BD4\u5982\u5723\u5F92\u88AB\u5904\u51B3\uFF09\u3002",
      "\u8BE5\u73A9\u5BB6\u5F53\u524D\u9189\u9152\u6216\u4E2D\u6BD2\uFF0C\u4F60\u9700\u8981\u51B3\u5B9A\u7ED9\u4ED6\u4EC0\u4E48\u4FE1\u606F\uFF08\u771F\u5B9E\u4FE1\u606F\u6216\u4F60\u7F16\u9020\u7684\u5047\u4FE1\u606F\uFF09\u3002",
      "",
      "## \u7B56\u7565\u539F\u5219",
      "\u9664\u975E\u90AA\u6076\u9635\u8425\u5DF2\u7ECF\u4F18\u52BF\u5DE8\u5927\uFF08\u4F8B\u5982\u5B58\u6D3B\u90AA\u6076\u4EBA\u6570 >= \u5B58\u6D3B\u5584\u826F\u4EBA\u6570\uFF0C\u4E14\u6076\u9B54\u6CA1\u6709\u88AB\u6000\u7591\uFF09\uFF0C\u5426\u5219\u4F60\u5E94\u8BE5\u4F18\u5148\u5E2E\u52A9\u90AA\u6076\u9635\u8425\u3002",
      "\u5E2E\u52A9\u90AA\u6076\u9635\u8425\u4E0D\u7B49\u540C\u4E8E\u4E00\u5B9A\u8981\u7ED9\u5047\u4FE1\u606F\u3002\u4F60\u9700\u8981\u81EA\u5DF1\u5224\u65AD\u4EC0\u4E48\u6837\u7684\u4FE1\u606F\uFF08\u65E0\u8BBA\u771F\u5047\uFF09\u66F4\u80FD\u5E2E\u52A9\u90AA\u6076\u9635\u8425\u3002",
      "",
      "## \u5EA7\u4F4D\u4E0E\u73A9\u5BB6\uFF08\u73A9\u5BB6\u5750\u6210\u4E00\u5708\uFF09",
      getSeatingSummary(),
      "",
      "## \u9B54\u5178\uFF08\u8BF4\u4E66\u4EBA\u53EF\u89C1\u7684\u5B8C\u6574\u4FE1\u606F\uFF09",
      getGrimoireSummary(),
      "",
      "## \u5B8C\u6574\u89D2\u8272\u80FD\u529B\u8868",
      FULL_ROLE_RULES,
      "",
      "## \u4FE1\u606F\u683C\u5F0F\u8981\u6C42",
      formatHint,
      "\u5982\u679C\u4F60\u51B3\u5B9A\u7ED9\u5047\u4FE1\u606F\uFF0C\u4F60\u7F16\u9020\u7684\u5047\u4FE1\u606F\u5FC5\u987B\u4E25\u683C\u9075\u5B88\u4E0A\u8FF0\u683C\u5F0F\u8981\u6C42\uFF0C\u4E14\u4E0E\u771F\u5B9E\u4FE1\u606F\u4E0D\u540C\u3002"
    ];
    if (demonSummaries) {
      instructionParts.push("", "## \u6076\u9B54\u7684\u6BCF\u65E5\u603B\u7ED3\uFF08\u4F9B\u4F60\u4E86\u89E3\u90AA\u6076\u9635\u8425\u89C6\u89D2\uFF09", demonSummaries);
    }
    instructionParts.push(
      "",
      "\u53EA\u8F93\u51FA JSON\uFF0C\u4E0D\u8981\u5305\u542B\u4EFB\u4F55\u989D\u5916\u6587\u672C\u6216\u6807\u8BB0\u3002",
      `\u8F93\u51FA\u4E25\u683C JSON\uFF1A{"show":"\u4F60\u8981\u7ED9\u7684\u4FE1\u606F","isTrue":true\u6216false,"reason":"\u4E00\u5C0F\u6BB5\u8BDD\u7406\u7531"}`
    );
    const prompt2 = [
      { role: "system", content: instructionParts.join("\n") },
      { role: "user", content: [
        `\u5F53\u524D\u5C40\u52BF\uFF1A${balanceSummary}`,
        `\u73A9\u5BB6\uFF1A${player.name}\uFF08\u771F\u5B9E\u9635\u8425=${TEAM_LABEL2[player.team] || player.team}\uFF0C\u771F\u5B9E\u89D2\u8272=${player.roleName}\uFF09`,
        `\u4FE1\u606F\u7C7B\u578B\uFF1A${label}`,
        `\u771F\u5B9E\u4FE1\u606F\uFF1A${trueInfo}`,
        `\u573A\u4E0A\u73A9\u5BB6\u540D\u5355\uFF1A${playerNames.join("\u3001")}`,
        `\u516C\u5F00\u8EAB\u4EFD\u58F0\u660E\uFF08\u6700\u65B0\uFF09\uFF1A${claimsSummary}`,
        `\u672C\u4FE1\u606F\u76F8\u5173\u73A9\u5BB6\u58F0\u660E\uFF1A${relatedClaims}`,
        `\u672C\u4FE1\u606F\u76F8\u5173\u73A9\u5BB6\u771F\u76F8\uFF08\u8BF4\u4E66\u4EBA\u53EF\u89C1\uFF09\uFF1A${relatedTruth}`
      ].join("\n") }
    ];
    try {
      const content = await callDeepSeek(prompt2, 0.2, null, "storyteller", false);
      const json = extractJson(content);
      if (json && typeof json.show === "string") {
        const show = String(json.show).trim();
        if (!show) return null;
        if (json.isTrue === true && show === trueInfo) {
          return { info: trueInfo, isTrue: true, source: "llm", reason: json.reason || "" };
        }
        if (json.isTrue === false && show !== trueInfo) {
          const needsPlayerName = ["\u6D17\u8863\u5987\u4FE1\u606F", "\u56FE\u4E66\u7BA1\u7406\u5458\u4FE1\u606F", "\u8C03\u67E5\u5458\u4FE1\u606F"].includes(label);
          if (needsPlayerName) {
            const hasValidName = playerNames.some((n) => show.includes(n));
            if (!hasValidName) return null;
          }
          return { info: show, isTrue: false, source: "llm", reason: json.reason || "" };
        }
        if (show === trueInfo) return { info: trueInfo, isTrue: true, source: "llm", reason: json.reason || "" };
      }
    } catch (_) {
    }
    return null;
  }
  function getRandomRoleNameByTeams(teams) {
    const pool = SCRIPT.roles.filter((r) => teams.includes(r.team));
    if (!pool.length) return "";
    return pool[Math.floor(Math.random() * pool.length)].name;
  }
  function normalizeRegistrationMode(roleName, rawMode) {
    const value = String(rawMode || "").trim().toLowerCase();
    if (["normal", "default", "\u771F\u5B9E", "\u666E\u901A"].includes(value)) return "normal";
    if (["good", "\u5584\u826F", "\u597D\u4EBA"].includes(value)) return "good";
    if (["minion", "\u722A\u7259"].includes(value)) return "minion";
    if (["demon", "\u6076\u9B54"].includes(value)) return "demon";
    if (roleName === "\u95F4\u8C0D") return "good";
    if (roleName === "\u964C\u5BA2") return "demon";
    return "normal";
  }
  function getRoleNameFromTeamsByHint(teams, hintedName = "") {
    const hint = String(hintedName || "").trim();
    if (hint) {
      const role = SCRIPT.roles.find((r) => r.name === hint);
      if (role && teams.includes(role.team)) return role.name;
    }
    return getRandomRoleNameByTeams(teams);
  }
  function getBaseRegistrationProfile(player) {
    if (!player) return { evil: false, minion: false, demon: false, roleName: "" };
    return {
      evil: player.team === "minion" || player.team === "demon",
      minion: player.team === "minion",
      demon: player.team === "demon",
      roleName: player.roleName
    };
  }
  function fallbackRegistrationProfile(player) {
    const base = getBaseRegistrationProfile(player);
    if (!player) return { ...base, source: "fallback", reason: "" };
    if (player.roleName === "\u95F4\u8C0D") {
      const maskAsGood = Math.random() < 0.7;
      if (maskAsGood) {
        return {
          evil: false,
          minion: false,
          demon: false,
          roleName: getRoleNameFromTeamsByHint(["townsfolk", "outsider"]),
          source: "fallback",
          reason: "fallback:spy_good"
        };
      }
      return {
        evil: true,
        minion: true,
        demon: false,
        roleName: player.roleName,
        source: "fallback",
        reason: "fallback:spy_normal"
      };
    }
    if (player.roleName === "\u964C\u5BA2") {
      if (isDroisoned(player)) {
        return { evil: false, minion: false, demon: false, roleName: player.roleName, source: "fallback", reason: "fallback:hermit_droisoned" };
      }
      const roll = Math.random();
      if (roll < 0.2) {
        return {
          evil: false,
          minion: false,
          demon: false,
          roleName: player.roleName,
          source: "fallback",
          reason: "fallback:hermit_normal"
        };
      }
      if (roll < 0.6) {
        return {
          evil: true,
          minion: true,
          demon: false,
          roleName: getRoleNameFromTeamsByHint(["minion"]),
          source: "fallback",
          reason: "fallback:hermit_minion"
        };
      }
      return {
        evil: true,
        minion: false,
        demon: true,
        roleName: getRoleNameFromTeamsByHint(["demon"]),
        source: "fallback",
        reason: "fallback:hermit_demon"
      };
    }
    return { ...base, source: "rule", reason: "" };
  }
  async function storytellerChooseRegistrationProfile(player) {
    if (!player) return null;
    const roleName = player.roleName;
    if (roleName !== "\u95F4\u8C0D" && roleName !== "\u964C\u5BA2") return null;
    if (isDroisoned(player)) {
      if (roleName === "\u964C\u5BA2") return { evil: false, minion: false, demon: false, roleName: player.roleName, source: "rule", reason: "hermit_poisoned" };
      if (roleName === "\u95F4\u8C0D") return { evil: true, minion: true, demon: false, roleName: player.roleName, source: "rule", reason: "spy_poisoned" };
    }
    const options = roleName === "\u95F4\u8C0D" ? "normal|good" : "normal|minion|demon";
    const instructionParts = [
      "\u4F60\u662F\u300A\u8840\u67D3\u949F\u697C\xB7\u6697\u6D41\u6D8C\u52A8\u300B\u7684\u8BF4\u4E66\u4EBA\u3002",
      `\u300A\u8840\u67D3\u949F\u697C\xB7\u6697\u6D41\u6D8C\u52A8\u300B\u662F\u4E00\u6B3E\u8FDB\u9636\u7248\u793E\u4EA4\u63A8\u7406\u6E38\u620F\uFF0C\u53EF\u7406\u89E3\u4E3A"\u6BCF\u4E2A\u4EBA\u90FD\u6709\u72EC\u7279\u8D85\u80FD\u529B\u7684\u72FC\u4EBA\u6740"\u3002`,
      `\u6838\u5FC3\u673A\u5236\u662F"\u6B7B\u800C\u4E0D\u50F5"\u548C"\u4FE1\u606F\u8FF7\u96FE"\uFF1A\u6B7B\u4EBA\u4ECD\u53EF\u53C2\u4E0E\u8BA8\u8BBA\u4E14\u62E5\u6709\u4E00\u7968\u6B7B\u4EBA\u7968\uFF1B\u9189\u9152\u4E0E\u4E2D\u6BD2\u4F1A\u8BA9\u6280\u80FD\u4E00\u5B9A\u5931\u6548\uFF0C\u4FE1\u606F\u5219\u53EF\u80FD\u9519\u8BEF\uFF0C\u9700\u8981\u903B\u8F91\u9A8C\u8BC1\u3002`,
      "\u6E38\u620F\u5206\u4E3A\u5584\u826F\u4E0E\u90AA\u6076\u9635\u8425\u3002\u9547\u6C11\u548C\u5916\u6765\u8005\u5C5E\u4E8E\u5584\u826F\u9635\u8425\uFF0C\u722A\u7259\u548C\u6076\u9B54\u5C5E\u4E8E\u90AA\u6076\u9635\u8425\u3002\u5584\u826F\u9635\u8425\u7684\u83B7\u80DC\u6761\u4EF6\u662F\u5904\u51B3\u6076\u9B54\uFF0C\u6216\u89E6\u53D1\u5584\u826F\u9635\u8425\u7279\u6B8A\u7684\u80DC\u5229\u673A\u5236\uFF08\u5982\u9547\u957F\u65E5\uFF09\uFF1B\u90AA\u6076\u9635\u8425\u7684\u83B7\u80DC\u6761\u4EF6\u662F\u8BA9\u573A\u4E0A\u4EC5\u5269\u4E24\u540D\u5B58\u6D3B\u73A9\u5BB6\u4E14\u6076\u9B54\u5B58\u6D3B\uFF0C\u6216\u89E6\u53D1\u5584\u826F\u9635\u8425\u7279\u6B8A\u7684\u5931\u8D25\u673A\u5236\uFF08\u6BD4\u5982\u5723\u5F92\u88AB\u5904\u51B3\uFF09\u3002",
      `\u4F60\u9700\u8981\u51B3\u5B9A\u8BE5\u73A9\u5BB6\u5728\u672C\u6B21\u591C\u665A\u4FE1\u606F\u5224\u5B9A\u4E2D\u7684"\u767B\u8BB0\u5F62\u6001"\u3002`,
      "",
      "## \u7B56\u7565\u539F\u5219",
      "\u9664\u975E\u90AA\u6076\u9635\u8425\u5DF2\u7ECF\u4F18\u52BF\u5DE8\u5927\uFF08\u4F8B\u5982\u5B58\u6D3B\u90AA\u6076\u4EBA\u6570 >= \u5B58\u6D3B\u5584\u826F\u4EBA\u6570\uFF0C\u4E14\u6076\u9B54\u6CA1\u6709\u88AB\u6000\u7591\uFF09\uFF0C\u5426\u5219\u4F60\u5E94\u8BE5\u4F18\u5148\u5E2E\u52A9\u90AA\u6076\u9635\u8425\u3002",
      "\u95F4\u8C0D\u88AB\u767B\u8BB0\u4E3A\u5584\u826F\u53EF\u4EE5\u5E72\u6270\u5584\u826F\u9635\u8425\u7684\u4FE1\u606F\u5224\u5B9A\uFF08\u5982\u53A8\u5E08\u3001\u5171\u60C5\u8005\u3001\u8C03\u67E5\u5458\u7B49\uFF09\uFF0C\u8FD9\u901A\u5E38\u5BF9\u90AA\u6076\u6709\u5229\u3002",
      "\u964C\u5BA2\u88AB\u767B\u8BB0\u4E3A\u722A\u7259/\u6076\u9B54\u53EF\u4EE5\u8BEF\u5BFC\u5584\u826F\u9635\u8425\u7684\u4FE1\u606F\uFF0C\u8FD9\u901A\u5E38\u4E5F\u5BF9\u90AA\u6076\u6709\u5229\u3002",
      "",
      "## \u5EA7\u4F4D\u4E0E\u73A9\u5BB6\uFF08\u73A9\u5BB6\u5750\u6210\u4E00\u5708\uFF09",
      getSeatingSummary(),
      "",
      "## \u9B54\u5178\uFF08\u8BF4\u4E66\u4EBA\u53EF\u89C1\u7684\u5B8C\u6574\u4FE1\u606F\uFF09",
      getGrimoireSummary(),
      "",
      "## \u5B8C\u6574\u89D2\u8272\u80FD\u529B\u8868",
      FULL_ROLE_RULES,
      "",
      "\u4F60\u53EA\u80FD\u4ECE\u7ED9\u5B9A\u9009\u9879\u91CC\u9009\u4E00\u4E2A register_as\uFF0C\u4E0D\u8981\u8F93\u51FA\u989D\u5916\u6587\u672C\u3002",
      "\u82E5\u89D2\u8272\u662F\u95F4\u8C0D\uFF1Anormal=\u6309\u771F\u5B9E\u90AA\u6076/\u722A\u7259\u767B\u8BB0\uFF1Bgood=\u6309\u5584\u826F\u767B\u8BB0\u5E76\u663E\u793A\u9547\u6C11/\u5916\u6765\u8005\u89D2\u8272\u3002",
      "\u82E5\u89D2\u8272\u662F\u964C\u5BA2\uFF1Anormal=\u6309\u771F\u5B9E\u5584\u826F\u767B\u8BB0\uFF1Bminion=\u6309\u722A\u7259\u767B\u8BB0\uFF1Bdemon=\u6309\u6076\u9B54\u767B\u8BB0\u3002"
    ];
    const demonSummaries = getDemonSummaries();
    if (demonSummaries) {
      instructionParts.push(
        "",
        "## \u6076\u9B54\u7684\u6BCF\u65E5\u603B\u7ED3\uFF08\u4F9B\u4F60\u4E86\u89E3\u90AA\u6076\u9635\u8425\u89C6\u89D2\uFF09",
        demonSummaries
      );
    }
    instructionParts.push(
      `\u8F93\u51FA\u4E25\u683C JSON\uFF1A{"register_as":"...","role_name":"\u53EF\u9009\uFF0C\u767B\u8BB0\u4E3A\u5584\u826F/\u722A\u7259/\u6076\u9B54\u65F6\u5177\u4F53\u663E\u793A\u7684\u89D2\u8272\u540D","reason":"\u4E00\u5C0F\u6BB5\u8BDD"}`
    );
    const instruction = instructionParts.join("\n");
    const prompt2 = [
      { role: "system", content: instruction },
      { role: "user", content: [
        `\u5F53\u524D\u5C40\u52BF\uFF1A${getStorytellerBalanceSummary()}`,
        `\u73A9\u5BB6\uFF1A${player.name}`,
        `\u771F\u5B9E\u89D2\u8272\uFF1A${player.roleName}`,
        `\u771F\u5B9E\u9635\u8425\uFF1A${TEAM_LABEL2[player.team] || player.team}`,
        `\u53EF\u9009\u767B\u8BB0\uFF1A${options}`,
        `\u516C\u5F00\u58F0\u660E\uFF08\u6700\u65B0\uFF09\uFF1A${getClaimsSummary(8)}`
      ].join("\n") }
    ];
    try {
      const content = await callDeepSeek(prompt2, 0.2, null, "storyteller", false);
      const json = extractJson(content);
      if (!json) return null;
      const mode = normalizeRegistrationMode(roleName, json.register_as || json.mode);
      const hintedRole = String(json.role_name || "").trim();
      const reason = String(json.reason || "").trim();
      if (roleName === "\u95F4\u8C0D") {
        if (mode === "normal") return { evil: true, minion: true, demon: false, roleName: player.roleName, source: "llm", reason };
        return { evil: false, minion: false, demon: false, roleName: getRoleNameFromTeamsByHint(["townsfolk", "outsider"], hintedRole), source: "llm", reason };
      }
      if (mode === "normal") return { evil: false, minion: false, demon: false, roleName: player.roleName, source: "llm", reason };
      if (mode === "minion") return { evil: true, minion: true, demon: false, roleName: getRoleNameFromTeamsByHint(["minion"], hintedRole), source: "llm", reason };
      return { evil: true, minion: false, demon: true, roleName: getRoleNameFromTeamsByHint(["demon"], hintedRole), source: "llm", reason };
    } catch (_) {
      return null;
    }
  }
  async function storytellerJudgeRecluseSlayer(shooter, target) {
    const demonSummaries = getDemonSummaries();
    const instructionParts = [
      "\u4F60\u662F\u300A\u8840\u67D3\u949F\u697C\xB7\u6697\u6D41\u6D8C\u52A8\u300B\u7684\u8BF4\u4E66\u4EBA\u3002",
      "\u730E\u624B\u6B63\u5728\u5BF9\u964C\u5BA2\u5F00\u67AA\uFF0C\u4F60\u9700\u8981\u51B3\u5B9A\u964C\u5BA2\u662F\u5426\u88AB\u767B\u8BB0\u4E3A\u6076\u9B54\uFF08\u82E5\u767B\u8BB0\u4E3A\u6076\u9B54\u5219\u964C\u5BA2\u6B7B\u4EA1\uFF09\u3002",
      "",
      "## \u7B56\u7565\u539F\u5219",
      "\u9664\u975E\u90AA\u6076\u9635\u8425\u5DF2\u7ECF\u4F18\u52BF\u5DE8\u5927\uFF0C\u5426\u5219\u4F60\u5E94\u8BE5\u4F18\u5148\u5E2E\u52A9\u90AA\u6076\u9635\u8425\u3002",
      "\u964C\u5BA2\u88AB\u767B\u8BB0\u4E3A\u6076\u9B54\u610F\u5473\u7740\u730E\u624B\u7684\u5B50\u5F39\u88AB\u6D6A\u8D39\u5728\u4E00\u4E2A\u5584\u826F\u73A9\u5BB6\u8EAB\u4E0A\uFF0C\u8FD9\u5BF9\u90AA\u6076\u9635\u8425\u6709\u5229\u3002",
      "",
      "## \u5EA7\u4F4D\u4E0E\u73A9\u5BB6\uFF08\u73A9\u5BB6\u5750\u6210\u4E00\u5708\uFF09",
      getSeatingSummary(),
      "",
      "## \u9B54\u5178\uFF08\u8BF4\u4E66\u4EBA\u53EF\u89C1\u7684\u5B8C\u6574\u4FE1\u606F\uFF09",
      getGrimoireSummary(),
      "",
      "## \u5B8C\u6574\u89D2\u8272\u80FD\u529B\u8868",
      FULL_ROLE_RULES
    ];
    if (demonSummaries) {
      instructionParts.push("", "## \u6076\u9B54\u7684\u6BCF\u65E5\u603B\u7ED3\uFF08\u4F9B\u4F60\u4E86\u89E3\u90AA\u6076\u9635\u8425\u89C6\u89D2\uFF09", demonSummaries);
    }
    instructionParts.push(
      "",
      `\u53EA\u8F93\u51FA JSON\uFF1A{"registers_as_demon":true\u6216false,"reason":"\u4E00\u5C0F\u6BB5\u8BDD\u7406\u7531"}`
    );
    const prompt2 = [
      { role: "system", content: instructionParts.join("\n") },
      { role: "user", content: [
        `\u5F53\u524D\u5C40\u52BF\uFF1A${getStorytellerBalanceSummary()}`,
        `\u730E\u624B\uFF1A${shooter.name}`,
        `\u76EE\u6807\u964C\u5BA2\uFF1A${target.name}`,
        `\u516C\u5F00\u8EAB\u4EFD\u58F0\u660E\uFF1A${getClaimsSummary(10)}`,
        `\u8BF7\u5224\u5B9A\uFF1A\u964C\u5BA2\u662F\u5426\u88AB\u767B\u8BB0\u4E3A\u6076\u9B54\uFF1F`
      ].join("\n") }
    ];
    try {
      const content = await callDeepSeek(prompt2, 0.2, null, "storyteller", false);
      const json = extractJson(content);
      if (json && typeof json.registers_as_demon === "boolean") return json.registers_as_demon;
    } catch (_) {
    }
    return false;
  }
  async function buildInfoRegistrationMap() {
    const map = {};
    if (!state || !Array.isArray(state.players)) return map;
    for (const player of state.players) {
      if (!player || !player.id) continue;
      if (player.roleName !== "\u95F4\u8C0D" && player.roleName !== "\u964C\u5BA2") {
        map[player.id] = { ...getBaseRegistrationProfile(player), source: "rule", reason: "" };
        continue;
      }
      let profile = null;
      if (STORYTELLER_REGISTER_LLM_ENABLED) {
        profile = await storytellerChooseRegistrationProfile(player);
      }
      if (!profile) {
        profile = fallbackRegistrationProfile(player);
      }
      map[player.id] = profile;
    }
    state.lastInfoRegistrationMap = map;
    return map;
  }
  function getRegistrationOverride(player, registrationMap) {
    if (!player || !registrationMap || typeof registrationMap !== "object") return null;
    const item = registrationMap[player.id];
    if (!item || typeof item !== "object") return null;
    return item;
  }
  function registersAsEvil(player, registrationMap = null) {
    const override = getRegistrationOverride(player, registrationMap);
    if (override && typeof override.evil === "boolean") return override.evil;
    if (!player) return false;
    if (player.roleName === "\u95F4\u8C0D") {
      return Math.random() < 0.3;
    }
    if (player.roleName === "\u964C\u5BA2") {
      if (isDroisoned(player)) return false;
      return Math.random() < 0.8;
    }
    return player.team === "minion" || player.team === "demon";
  }
  function registersAsMinion(player, registrationMap = null) {
    const override = getRegistrationOverride(player, registrationMap);
    if (override && typeof override.minion === "boolean") return override.minion;
    if (!player) return false;
    if (player.roleName === "\u95F4\u8C0D") {
      return Math.random() < 0.3;
    }
    if (player.roleName === "\u964C\u5BA2") {
      if (isDroisoned(player)) return false;
      return Math.random() < 0.4;
    }
    return player.team === "minion";
  }
  function registersAsDemon(player, registrationMap = null) {
    const override = getRegistrationOverride(player, registrationMap);
    if (override && typeof override.demon === "boolean") return override.demon;
    if (!player) return false;
    if (player.roleName === "\u964C\u5BA2") {
      if (isDroisoned(player)) return false;
      return Math.random() < 0.4;
    }
    return player.team === "demon";
  }
  function formatSpyGrimoireEntry(player) {
    if (!player) return "";
    let label = `${player.name}:${player.roleName}`;
    if (player.drunk && player.apparentRoleName && player.apparentRoleName !== player.roleName) {
      label += `\uFF08\u81EA\u8BA4\u4E3A:${player.apparentRoleName}\uFF09`;
    }
    return label;
  }
  function registerRoleForInfo(player, registrationMap = null) {
    const override = getRegistrationOverride(player, registrationMap);
    if (override && typeof override.roleName === "string" && override.roleName) {
      return override.roleName;
    }
    if (!player) return "";
    if (player.roleName === "\u964C\u5BA2" && !isDroisoned(player) && Math.random() > 0.5) {
      return getRandomRoleNameByTeams(["minion", "demon"]);
    }
    if (player.roleName === "\u95F4\u8C0D" && Math.random() > 0.5) {
      return getRandomRoleNameByTeams(["townsfolk", "outsider"]);
    }
    return player.roleName;
  }
  function getMinionRoleNameForInfo(player, registrationMap = null) {
    const override = getRegistrationOverride(player, registrationMap);
    if (override && override.minion && typeof override.roleName === "string" && override.roleName) {
      return override.roleName;
    }
    if (!player) return "";
    if (player.team === "minion") {
      return player.roleName;
    }
    return getRandomRoleNameByTeams(["minion"]);
  }
  function setPrivateInfo(player, text) {
    const tag = state?.phase === "night" ? `\u7B2C${state.nightCount}\u665A` : state?.phase === "day" ? `\u7B2C${state.dayCount}\u5929` : "";
    const line = tag ? `${tag}\uFF1A${text}` : text;
    player.privateInfo.push(line);
    player.memory.push(line);
    if (player.isHuman) {
      renderHumanInfo();
    }
  }
  function applyPoison() {
    state.players.forEach((player) => {
      if (player.poisoned && player.poisonedUntilDay <= state.dayCount) {
        player.poisoned = false;
      }
    });
  }
  function chooseRandomTarget(source, allowSelf = false, includeDead = false) {
    const candidates = state.players.filter(
      (p) => (includeDead || p.alive) && (allowSelf || p.id !== source.id)
    );
    if (!candidates.length) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  function chooseTwoTargets(source) {
    const candidates = state.players.filter((p) => p.alive && p.id !== source.id);
    if (candidates.length < 2) return candidates;
    const shuffled = shuffle(candidates);
    return [shuffled[0], shuffled[1]];
  }
  function recordRoleChange(player, newRoleName, reason = "") {
    if (!player || !newRoleName) return;
    if (!Array.isArray(player.roleHistory)) {
      player.roleHistory = [];
    }
    player.roleHistory.push({
      roleName: newRoleName,
      phase: getPhaseLabel(),
      night: state?.nightCount || 0,
      day: state?.dayCount || 0,
      reason: reason || ""
    });
  }
  function makeRolePair(rolePlayer, excludeId = "") {
    if (!rolePlayer) return [];
    const others = state.players.filter(
      (p) => p.id !== rolePlayer.id && p.id !== excludeId
    );
    const fallback = state.players.filter((p) => p.id !== rolePlayer.id);
    const pool = others.length ? others : fallback;
    const other = pool.length ? pool[Math.floor(Math.random() * pool.length)] : rolePlayer;
    return shuffle([rolePlayer, other]).slice(0, 2);
  }
  async function resolveSlayerShot(shooter, target, isReal) {
    if (!shooter || !target || !shooter.alive) return;
    let canKill = false;
    if (isReal && !isDroisoned(shooter)) {
      if (target.team === "demon") {
        canKill = true;
      } else if (target.roleName === "\u964C\u5BA2") {
        canKill = await storytellerJudgeRecluseSlayer(shooter, target);
      }
    }
    addChat("\u8BF4\u4E66\u4EBA", `${shooter.name} \u8868\u793A\u8981\u5F00\u67AA\uFF0C\u76EE\u6807\u662F ${target.name}\u3002`, "storyteller");
    addLogEntry(`\u730E\u624B\u5C04\u51FB\uFF1A${shooter.name} -> ${target.name}`, "day");
    addReplayEvent(`\u730E\u624B\u5C04\u51FB\uFF1A${shooter.name} -> ${target.name}`, "day_action");
    if (canKill) {
      target.alive = false;
      addChat("\u8BF4\u4E66\u4EBA", `${target.name} \u6B7B\u4EA1\u3002`, "storyteller");
      addLogEntry(`\u730E\u624B\u51FB\u6740\u6076\u9B54\uFF1A${target.name}`, "day");
      addReplayEvent(`\u730E\u624B\u51FB\u6740\u6076\u9B54\uFF1A${target.name}`, "day_action");
    } else {
      addChat("\u8BF4\u4E66\u4EBA", `${target.name} \u5E76\u672A\u6B7B\u4EA1\u3002`, "storyteller");
    }
    renderAll();
    checkWin();
  }
  async function useSlayerShot(shooter, target) {
    if (!shooter || !target || !shooter.alive) return;
    if (shooter.slayerUsed) return;
    shooter.slayerUsed = true;
    shooter.slayerClaimed = true;
    await resolveSlayerShot(shooter, target, true);
  }
  function parseSlayerDeclaration(text, shooter) {
    const raw = String(text || "").trim();
    if (!raw || !state || !Array.isArray(state.players)) {
      return { detected: false, valid: false, target: null, error: "empty" };
    }
    const compact = raw.replace(/\s+/g, "");
    if (compact.includes("\u8981\u5411\u73A9\u5BB6X\u5F00\u67AA") || compact.includes("\u8981\u5411\u73A9\u5BB6x\u5F00\u67AA")) {
      return { detected: false, valid: false, target: null, error: "template_echo" };
    }
    const detected = compact.includes("\u730E\u624B") && compact.includes("\u6211\u8981\u5411") && compact.includes("\u5F00\u67AA");
    if (!detected) {
      return { detected: false, valid: false, target: null, error: "none" };
    }
    const match = compact.match(/我是猎手[，,]?我要向(玩家([0-9]{1,2})|自己|我自己)开枪/);
    if (!match) {
      return { detected: true, valid: false, target: null, error: "format" };
    }
    let target = null;
    if (match[2]) {
      const seat = Number(match[2]);
      if (!Number.isFinite(seat) || seat < 1 || seat > state.players.length) {
        return { detected: true, valid: false, target: null, error: "target" };
      }
      const player = state.players[seat - 1];
      if (!player || !player.alive) {
        return { detected: true, valid: false, target: null, error: "target" };
      }
      target = player;
    } else {
      if (!shooter || !shooter.alive) {
        return { detected: true, valid: false, target: null, error: "target" };
      }
      target = shooter;
    }
    return { detected: true, valid: true, target, error: "" };
  }
  function maybeHandleSlayerClaim(speaker, text) {
    if (!state || !state.started || state.ended) return;
    if (state.phase !== "day" || state.dayStage !== "discussion") return;
    const shooter = state.players.find((p) => p.name === speaker);
    if (!shooter || !shooter.alive) return;
    const declaration = parseSlayerDeclaration(text, shooter);
    if (!declaration.detected) return;
    if (!declaration.valid) {
      if (declaration.error === "format") {
        addChat("\u8BF4\u4E66\u4EBA", `\u730E\u624B\u58F0\u660E\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u672C\u6B21\u4E0D\u89C6\u4E3A\u5F00\u67AA\u3002\u6B63\u786E\u683C\u5F0F\uFF1A${SLAYER_DECLARATION_TEMPLATE}`, "storyteller");
      } else {
        addChat("\u8BF4\u4E66\u4EBA", "\u730E\u624B\u58F0\u660E\u76EE\u6807\u65E0\u6548\uFF08\u76EE\u6807\u4E0D\u5B58\u5728\u6216\u5DF2\u6B7B\u4EA1\uFF09\uFF0C\u672C\u6B21\u4E0D\u89C6\u4E3A\u5F00\u67AA\u3002", "storyteller");
      }
      return;
    }
    const target = declaration.target;
    if (shooter.slayerClaimed) return;
    shooter.slayerClaimed = true;
    const isReal = shooter.roleName === "\u730E\u624B" && !shooter.slayerUsed;
    if (isReal) {
      shooter.slayerUsed = true;
    }
    resolveSlayerShot(shooter, target, isReal);
  }
  function canButlerVote(voter) {
    if (!voter || voter.roleName !== "\u7BA1\u5BB6") return true;
    if (!voter.alive) return true;
    if (isDroisoned(voter)) return true;
    if (!voter.butlerMasterId) return false;
    const master = state.players.find((p) => p.id === voter.butlerMasterId);
    if (!master || !master.alive) return false;
    return Boolean(state.nominationVotes[master.id]);
  }
  async function resolveInfoResult(player, label, trueInfo, fallbackOptions, context = null) {
    if (!isDroisoned(player)) {
      return { info: trueInfo, isTrue: true, droisoned: false, source: "none", reason: "" };
    }
    const safeFallbacks = Array.isArray(fallbackOptions) ? fallbackOptions.filter(Boolean) : [];
    if (STORYTELLER_LLM_ENABLED) {
      const decision = await storytellerChooseInfo(player, label, trueInfo, safeFallbacks, context);
      if (decision) {
        return {
          info: decision.info,
          isTrue: decision.isTrue,
          droisoned: true,
          source: decision.source || "llm",
          reason: decision.reason || ""
        };
      }
    }
    const tellTruth = storytellerTruthBias(player);
    if (tellTruth) {
      return { info: trueInfo, isTrue: true, droisoned: true, source: "heuristic", reason: "\u6982\u7387\u5224\u5B9A\u7ED9\u771F\u4FE1\u606F" };
    }
    let info = trueInfo;
    if (safeFallbacks.length) {
      info = safeFallbacks[Math.floor(Math.random() * safeFallbacks.length)];
    } else {
      info = generateRandomFalseInfo(label, trueInfo);
    }
    return { info, isTrue: info === trueInfo, droisoned: true, source: "heuristic", reason: "\u6982\u7387\u5224\u5B9A\u7ED9\u5047\u4FE1\u606F" };
  }
  function recordInfoAudit(player, label, trueInfo, shownInfo, isTrue, droisoned, source = "", reason = "") {
    if (!state || !player) return;
    if (!Array.isArray(state.infoAudit)) state.infoAudit = [];
    state.infoAudit.push({
      time: (/* @__PURE__ */ new Date()).toISOString(),
      phase: getPhaseLabel(),
      night: state.nightCount,
      day: state.dayCount,
      player: player.name,
      label,
      trueInfo,
      shownInfo,
      isTrue: Boolean(isTrue),
      droisoned: Boolean(droisoned),
      decisionSource: source || "",
      decisionReason: reason || ""
    });
  }
  function recordInfoDistortion(player, label, trueInfo, shownInfo) {
    if (!player) return;
    if (isDroisoned(player) && shownInfo !== trueInfo) {
      addReplayEvent(`\u4FE1\u606F\u5931\u771F\uFF1A${player.name} ${label} | \u771F\u5B9E\uFF1A${trueInfo} | \u544A\u77E5\uFF1A${shownInfo}`, "info_error");
    }
  }
  function recordFirstNightRecognition() {
    const totalPlayers = state.players.length;
    const demons = state.players.filter((p) => p.team === "demon");
    const minions = state.players.filter((p) => p.team === "minion");
    const blockedRoleNames = /* @__PURE__ */ new Set();
    state.players.forEach((player) => {
      if (player.roleName) blockedRoleNames.add(player.roleName);
      if (player.apparentRoleName) blockedRoleNames.add(player.apparentRoleName);
    });
    const bluffPool = SCRIPT.roles.filter(
      (r) => (r.team === "townsfolk" || r.team === "outsider") && !blockedRoleNames.has(r.name) && r.name !== "\u9152\u9B3C"
    );
    const bluffs = shuffle(bluffPool).slice(0, 3).map((r) => r.name);
    demons.forEach((demon) => {
      setPrivateInfo(demon, `\u4E09\u4E2A\u4E0D\u5728\u573A\u8EAB\u4EFD\uFF1A${bluffs.join(" / ") || "\u65E0"}`);
    });
    if (totalPlayers >= 7) {
      demons.forEach((demon) => {
        setPrivateInfo(demon, `\u4F60\u770B\u5230\u722A\u7259\uFF1A${minions.map((m) => m.name).join("\u3001") || "\u65E0"}`);
      });
      minions.forEach((minion) => {
        setPrivateInfo(minion, `\u4F60\u770B\u5230\u6076\u9B54\uFF1A${demons.map((d) => d.name).join("\u3001") || "\u65E0"}`);
        const others = minions.filter((m) => m.id !== minion.id).map((m) => m.name);
        setPrivateInfo(minion, `\u4F60\u770B\u5230\u722A\u7259\uFF1A${others.join("\u3001") || "\u65E0"}`);
      });
    }
    state.firstNightRecognitionDone = true;
  }
  async function resolveNight2() {
    if (!state.started || state.phase !== "night") return;
    if (state.paused) return;
    if (needsHumanNightAction() && !isHumanActionReady()) {
      addChat("\u7CFB\u7EDF", "\u8BF7\u5148\u786E\u8BA4\u4F60\u7684\u591C\u665A\u884C\u52A8\u3002", "system");
      return;
    }
    clearAutoNightTimer();
    try {
      if (state.nightCount === 1 && !state.firstNightRecognitionDone) {
        recordFirstNightRecognition();
      }
      applyPoison();
      state.players.forEach((p) => {
        p.protected = false;
      });
      const human = state.players.find((p) => p.isHuman);
      const demon = state.players.find((p) => p.team === "demon" && p.alive);
      const poisoner = state.players.find((p) => p.roleName === "\u6295\u6BD2\u8005" && p.alive);
      const monk = state.players.find((p) => p.roleName === "\u50E7\u4FA3" && p.alive);
      const butler = state.players.find((p) => p.roleName === "\u7BA1\u5BB6" && p.alive);
      const fortuneTeller = getInfoRolePlayer("\u5360\u535C\u5E08");
      const empath = getInfoRolePlayer("\u5171\u60C5\u8005");
      const chef = getInfoRolePlayer("\u53A8\u5E08");
      const washerwoman = getInfoRolePlayer("\u6D17\u8863\u5987");
      const librarian = getInfoRolePlayer("\u56FE\u4E66\u7BA1\u7406\u5458");
      const investigator = getInfoRolePlayer("\u8C03\u67E5\u5458");
      const undertaker = getInfoRolePlayer("\u9001\u846C\u8005");
      const ravenkeeper = getInfoRolePlayer("\u5B88\u9E26\u4EBA");
      const spy = getInfoRolePlayer("\u95F4\u8C0D");
      const infoRegistrationMap = await buildInfoRegistrationMap();
      if (poisoner) {
        let target = null;
        if (human && human.roleName === "\u6295\u6BD2\u8005" && state.humanActionTarget) {
          target = state.players.find((p) => p.id === state.humanActionTarget);
        } else {
          const candidates = state.players.slice();
          target = await aiChooseSingleTarget(poisoner, candidates, "\u6295\u6BD2\u4E00\u540D\u73A9\u5BB6\uFF08\u4ECA\u665A\u4E0E\u660E\u5929\u767D\u5929\u4E2D\u6BD2\uFF09");
          if (!target) target = chooseRandomTarget(poisoner, true, true);
        }
        if (target) {
          target.poisoned = true;
          target.poisonedUntilDay = state.dayCount + 1;
          addReplayEvent(`\u6295\u6BD2\u8005\u9009\u62E9 ${poisoner.name} -> ${target.name}`, "night_action");
        }
      }
      if (monk && state.nightCount > 1) {
        let target = null;
        if (human && human.roleName === "\u50E7\u4FA3" && state.humanActionTarget) {
          target = state.players.find((p) => p.id === state.humanActionTarget);
        } else {
          const candidates = state.players.filter((p) => p.alive && p.id !== monk.id);
          target = await aiChooseSingleTarget(monk, candidates, "\u5B88\u62A4\u4E00\u540D\u73A9\u5BB6\uFF08\u514D\u53D7\u6076\u9B54\u80FD\u529B\uFF09");
          if (!target) target = chooseRandomTarget(monk, false);
        }
        if (target) {
          const monkDisabled = isDroisoned(monk);
          if (!monkDisabled) {
            target.protected = true;
            addReplayEvent(`\u50E7\u4FA3\u4FDD\u62A4 ${monk.name} -> ${target.name}`, "night_action");
          } else {
            addReplayEvent(`\u50E7\u4FA3\u4FDD\u62A4\u5931\u6548\uFF08\u4E2D\u6BD2/\u9189\u9152\uFF09\uFF1A${monk.name} -> ${target.name}`, "night_action");
          }
        }
      }
      let demonTarget = null;
      if (demon && state.nightCount > 1) {
        if (demon.demonCooldownNight === state.nightCount) {
          addReplayEvent(`\u65B0\u6076\u9B54\u5F53\u591C\u65E0\u6CD5\u51FA\u5200\uFF1A${demon.name}`, "night_action");
        } else {
          if (human && human.roleName === "\u5C0F\u6076\u9B54" && state.humanActionTarget) {
            demonTarget = state.players.find((p) => p.id === state.humanActionTarget);
          } else {
            const candidates = state.players.slice();
            const minions = state.players.filter((p) => p.alive && p.team === "minion");
            const extraNote = minions.length ? "\u4F60\u53EF\u4EE5\u9009\u62E9\u81EA\u5DF1\u4EE5\u81EA\u6740\u4F20\u4F4D\uFF0C\u4F46\u4E00\u822C\u8C28\u614E\u4F7F\u7528\u3002" : "\u8BF7\u4E0D\u8981\u9009\u62E9\u81EA\u5DF1\u81EA\u6740\uFF08\u573A\u4E0A\u65E0\u5B58\u6D3B\u722A\u7259\u4F1A\u5BFC\u81F4\u76F4\u63A5\u5931\u8D25\uFF09\u3002";
            demonTarget = await aiChooseSingleTarget(demon, candidates, "\u9009\u62E9\u4E00\u540D\u73A9\u5BB6\u6B7B\u4EA1\uFF08\u6076\u9B54\u51FB\u6740\uFF09", extraNote);
            if (!demonTarget) demonTarget = chooseRandomTarget(demon, true, true);
          }
          if (demonTarget) {
            addReplayEvent(`\u6076\u9B54\u9009\u62E9 ${demon.name} -> ${demonTarget.name}`, "night_action");
          }
        }
      }
      if (chef && state.nightCount === 1) {
        let pairs = 0;
        for (let i = 0; i < state.players.length; i += 1) {
          const next = (i + 1) % state.players.length;
          if (registersAsEvil(state.players[i], infoRegistrationMap) && registersAsEvil(state.players[next], infoRegistrationMap)) {
            pairs += 1;
          }
        }
        const truth = `${pairs} \u5BF9\u76F8\u90BB\u90AA\u6076\u73A9\u5BB6`;
        const result = await resolveInfoResult(chef, "\u53A8\u5E08\u4FE1\u606F", truth, [
          "0 \u5BF9\u76F8\u90BB\u90AA\u6076\u73A9\u5BB6",
          "1 \u5BF9\u76F8\u90BB\u90AA\u6076\u73A9\u5BB6",
          "2 \u5BF9\u76F8\u90BB\u90AA\u6076\u73A9\u5BB6"
        ]);
        setPrivateInfo(chef, `\u53A8\u5E08\u4FE1\u606F\uFF1A${result.info}`);
        recordInfoAudit(chef, "\u53A8\u5E08\u4FE1\u606F", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
        recordInfoDistortion(chef, "\u53A8\u5E08\u4FE1\u606F", truth, result.info);
      }
      if (washerwoman && state.nightCount === 1) {
        const townsfolkInPlay = state.players.filter((p) => p.team === "townsfolk");
        const townsfolkCandidates = townsfolkInPlay.filter((p) => p.id !== washerwoman.id);
        const chosen = townsfolkCandidates[Math.floor(Math.random() * townsfolkCandidates.length)];
        const rolePlayer = chosen || townsfolkCandidates[0] || townsfolkInPlay[0];
        const pair = makeRolePair(rolePlayer, washerwoman.id);
        const truth = pair.length === 2 ? `${pair[0].name} \u6216 ${pair[1].name} \u662F ${chosen.roleName}` : `${rolePlayer.name} \u662F ${chosen.roleName}`;
        const relatedNames = pair.map((p) => p.name);
        const fakeRole = SCRIPT.roles.find((r) => r.team === "townsfolk" && !townsfolkInPlay.some((p) => p.roleId === r.id));
        const fakePlayers = shuffle(state.players.filter((p) => p.id !== washerwoman.id)).slice(0, 2);
        const fake = fakeRole ? `${fakePlayers[0].name} \u6216 ${fakePlayers[1].name} \u662F ${fakeRole.name}` : truth;
        const result = await resolveInfoResult(washerwoman, "\u6D17\u8863\u5987\u4FE1\u606F", truth, [fake], { relatedNames });
        setPrivateInfo(washerwoman, `\u6D17\u8863\u5987\u4FE1\u606F\uFF1A${result.info}`);
        recordInfoAudit(washerwoman, "\u6D17\u8863\u5987\u4FE1\u606F", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
        recordInfoDistortion(washerwoman, "\u6D17\u8863\u5987\u4FE1\u606F", truth, result.info);
      }
      if (librarian && state.nightCount === 1) {
        const outsidersInPlay = state.players.filter((p) => p.team === "outsider");
        const outsiderRoles = SCRIPT.roles.filter((r) => r.team === "outsider");
        let chosenOutsider = null;
        let truth = "\u6CA1\u6709\u5916\u6765\u8005\u5728\u573A";
        let relatedNames = [];
        if (outsidersInPlay.length) {
          chosenOutsider = outsidersInPlay[Math.floor(Math.random() * outsidersInPlay.length)];
          const rolePlayer = chosenOutsider || outsidersInPlay[0];
          const pair = makeRolePair(rolePlayer, librarian.id);
          truth = pair.length === 2 ? `${pair[0].name} \u6216 ${pair[1].name} \u662F ${chosenOutsider.roleName}` : `${rolePlayer.name} \u662F ${chosenOutsider.roleName}`;
          relatedNames = pair.map((p) => p.name);
        }
        let fake = "";
        if (outsiderRoles.length) {
          let fakeRolePool = outsiderRoles;
          if (chosenOutsider && outsiderRoles.length > 1) {
            fakeRolePool = outsiderRoles.filter((r) => r.name !== chosenOutsider.roleName);
          }
          const fakeRole = fakeRolePool[Math.floor(Math.random() * fakeRolePool.length)];
          const baseCandidates = state.players.filter((p) => p.id !== librarian.id);
          let fakeCandidates = baseCandidates.filter((p) => p.roleId !== fakeRole.id);
          if (fakeCandidates.length < 2) {
            fakeCandidates = baseCandidates;
          }
          const fakePair = shuffle(fakeCandidates).slice(0, 2);
          if (fakePair.length === 2) {
            fake = `${fakePair[0].name} \u6216 ${fakePair[1].name} \u662F ${fakeRole.name}`;
          }
        }
        const fallbacks = fake ? [fake] : [];
        const result = await resolveInfoResult(librarian, "\u56FE\u4E66\u7BA1\u7406\u5458\u4FE1\u606F", truth, fallbacks, { relatedNames });
        setPrivateInfo(librarian, `\u56FE\u4E66\u7BA1\u7406\u5458\u4FE1\u606F\uFF1A${result.info}`);
        recordInfoAudit(librarian, "\u56FE\u4E66\u7BA1\u7406\u5458\u4FE1\u606F", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
        recordInfoDistortion(librarian, "\u56FE\u4E66\u7BA1\u7406\u5458\u4FE1\u606F", truth, result.info);
      }
      if (investigator && state.nightCount === 1) {
        const minionsInPlay = state.players.filter((p) => registersAsMinion(p, infoRegistrationMap));
        const minionRoles = SCRIPT.roles.filter((r) => r.team === "minion").map((r) => r.name);
        let truth = "\u6CA1\u6709\u722A\u7259\u5728\u573A";
        let relatedNames = [];
        if (minionsInPlay.length) {
          const chosen = minionsInPlay[Math.floor(Math.random() * minionsInPlay.length)];
          const pair = makeRolePair(chosen, investigator.id);
          const roleName = getMinionRoleNameForInfo(chosen, infoRegistrationMap);
          truth = `${pair[0].name} \u6216 ${pair[1].name} \u662F ${roleName}`;
          relatedNames = pair.map((p) => p.name);
        }
        let fake = "\u6CA1\u6709\u722A\u7259\u5728\u573A";
        if (minionsInPlay.length) {
          const fakeRolePool = minionRoles.filter((name) => name !== truth.split(" \u662F ").pop());
          const fakeRole = fakeRolePool.length ? fakeRolePool[Math.floor(Math.random() * fakeRolePool.length)] : minionRoles[0] || "\u722A\u7259";
          const fakePlayers = shuffle(state.players.filter((p) => p.id !== investigator.id)).slice(0, 2);
          if (fakePlayers.length === 2) {
            fake = `${fakePlayers[0].name} \u6216 ${fakePlayers[1].name} \u662F ${fakeRole}`;
          } else {
            fake = truth;
          }
        } else if (minionRoles.length) {
          const fakePlayers = shuffle(state.players.filter((p) => p.id !== investigator.id)).slice(0, 2);
          if (fakePlayers.length === 2) {
            fake = `${fakePlayers[0].name} \u6216 ${fakePlayers[1].name} \u662F ${minionRoles[0]}`;
          }
        }
        const result = await resolveInfoResult(investigator, "\u8C03\u67E5\u5458\u4FE1\u606F", truth, [fake], { relatedNames });
        setPrivateInfo(investigator, `\u8C03\u67E5\u5458\u4FE1\u606F\uFF1A${result.info}`);
        recordInfoAudit(investigator, "\u8C03\u67E5\u5458\u4FE1\u606F", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
        recordInfoDistortion(investigator, "\u8C03\u67E5\u5458\u4FE1\u606F", truth, result.info);
      }
      let killed = null;
      if (state.nightCount > 1 && demonTarget && demonTarget.alive) {
        const targetRole = getRoleById(demonTarget.roleId);
        if (targetRole && targetRole.name === "\u9547\u957F" && !isDroisoned(demonTarget) && Math.random() > 0.5) {
          const alternatives = state.players.filter(
            (p) => p.alive && p.id !== demonTarget.id && p.team !== "minion" && p.team !== "demon"
          );
          if (alternatives.length) {
            addReplayEvent(`\u9547\u957F\u66FF\u6B7B\u89E6\u53D1\uFF0C\u76EE\u6807\u4ECE ${demonTarget.name} \u8F6C\u79FB`, "night_action");
            demonTarget = alternatives[Math.floor(Math.random() * alternatives.length)];
          }
        }
        if (demon && demonTarget.id === demon.id) {
          const minions = state.players.filter((p) => p.alive && p.team === "minion");
          if (minions.length) {
            const successor = minions[Math.floor(Math.random() * minions.length)];
            const demonRole = SCRIPT.roles.find((r) => r.team === "demon");
            successor.team = "demon";
            successor.roleId = demonRole.id;
            successor.roleName = demonRole.name;
            successor.apparentRoleId = demonRole.id;
            successor.apparentRoleName = demonRole.name;
            successor.demonCooldownNight = state.nightCount;
            recordRoleChange(successor, demonRole.name, "\u6076\u9B54\u4F20\u4F4D");
            addReplayEvent(`\u6076\u9B54\u4F20\u4F4D\uFF1A${successor.name} \u5F53\u591C\u4E0D\u51FA\u5200`, "night_action");
          }
          demonTarget.alive = false;
          killed = demonTarget;
        } else {
          const soldierImmune = targetRole && targetRole.name === "\u58EB\u5175" && !isDroisoned(demonTarget);
          const protectedKill = demonTarget.protected || soldierImmune;
          if (!protectedKill) {
            demonTarget.alive = false;
            killed = demonTarget;
          } else {
            addReplayEvent(`\u6076\u9B54\u51FB\u6740\u5931\u8D25\uFF08\u88AB\u4FDD\u62A4/\u58EB\u5175\uFF09\u76EE\u6807\uFF1A${demonTarget.name}`, "night_action");
          }
        }
      }
      if (ravenkeeper && killed && ravenkeeper.id === killed.id) {
        let target = null;
        if (human && human.roleName === "\u5B88\u9E26\u4EBA") {
          target = chooseRandomTarget(ravenkeeper, true);
        } else {
          const candidates = state.players.filter((p) => p.alive);
          target = await aiChooseSingleTarget(ravenkeeper, candidates, "\u5B88\u9E26\u4EBA\u9009\u62E9\u4E00\u540D\u73A9\u5BB6\u5F97\u77E5\u5176\u89D2\u8272");
          if (!target) target = chooseRandomTarget(ravenkeeper, true);
        }
        if (target) {
          const registeredRole = registerRoleForInfo(target, infoRegistrationMap);
          const result = await resolveInfoResult(
            ravenkeeper,
            "\u5B88\u9E26\u4EBA\u4FE1\u606F",
            registeredRole,
            SCRIPT.roles.map((r) => r.name),
            { relatedNames: [target.name] }
          );
          setPrivateInfo(ravenkeeper, `\u5B88\u9E26\u4EBA\u4FE1\u606F\uFF1A${target.name} \u662F ${result.info}`);
          recordInfoAudit(ravenkeeper, "\u5B88\u9E26\u4EBA\u4FE1\u606F", registeredRole, result.info, result.isTrue, result.droisoned, result.source, result.reason);
          recordInfoDistortion(ravenkeeper, "\u5B88\u9E26\u4EBA\u4FE1\u606F", registeredRole, result.info);
        }
      }
      if (empath && empath.alive) {
        const neighbors = getAliveNeighbors(state.players.indexOf(empath));
        const evilCount = neighbors.filter((p) => registersAsEvil(p, infoRegistrationMap)).length;
        const truth = `${evilCount}`;
        const result = await resolveInfoResult(empath, "\u5171\u60C5\u8005\u4FE1\u606F", truth, ["0", "1", "2"]);
        setPrivateInfo(empath, `\u5171\u60C5\u8005\u4FE1\u606F\uFF1A\u76F8\u90BB\u90AA\u6076\u4EBA\u6570 ${result.info}`);
        recordInfoAudit(empath, "\u5171\u60C5\u8005\u4FE1\u606F", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
        recordInfoDistortion(empath, "\u5171\u60C5\u8005\u4FE1\u606F", truth, result.info);
      }
      if (fortuneTeller && fortuneTeller.alive) {
        let targets = [];
        const humanApparent = human ? getApparentRole(human) : null;
        if (human && humanApparent && humanApparent.name === "\u5360\u535C\u5E08" && state.humanActionTarget2) {
          const t1 = state.players.find((p) => p.id === state.humanActionTarget);
          const t2 = state.players.find((p) => p.id === state.humanActionTarget2);
          targets = [t1, t2].filter(Boolean);
        } else {
          const candidates = state.players.filter((p) => p.alive && p.id !== fortuneTeller.id);
          targets = await aiChooseTwoTargets(fortuneTeller, candidates, "\u5360\u535C\u4E24\u540D\u73A9\u5BB6\uFF08\u5224\u65AD\u662F\u5426\u6709\u6076\u9B54\uFF09");
          if (targets.length < 2) targets = chooseTwoTargets(fortuneTeller);
        }
        const demonHit = targets.some(
          (t) => t && (t.team === "demon" || t.id === state.redHerringId || registersAsDemon(t, infoRegistrationMap))
        );
        const truth = demonHit ? "\u6709\u6076\u9B54" : "\u6CA1\u6709\u6076\u9B54";
        const result = await resolveInfoResult(
          fortuneTeller,
          "\u5360\u535C\u5E08\u4FE1\u606F",
          truth,
          [demonHit ? "\u6CA1\u6709\u6076\u9B54" : "\u6709\u6076\u9B54"],
          { relatedNames: targets.map((t) => t.name) }
        );
        setPrivateInfo(
          fortuneTeller,
          `\u5360\u535C\u5E08\u4FE1\u606F\uFF1A${targets.map((t) => t.name).join(" \u4E0E ")} -> ${result.info}`
        );
        recordInfoAudit(fortuneTeller, "\u5360\u535C\u5E08\u4FE1\u606F", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
        recordInfoDistortion(fortuneTeller, "\u5360\u535C\u5E08\u4FE1\u606F", truth, result.info);
      }
      if (butler && butler.alive) {
        let target = null;
        if (human && human.roleName === "\u7BA1\u5BB6" && state.humanActionTarget) {
          target = state.players.find((p) => p.id === state.humanActionTarget);
        } else {
          const candidates = state.players.filter((p) => p.alive && p.id !== butler.id);
          target = await aiChooseSingleTarget(butler, candidates, "\u9009\u62E9\u4E00\u540D\u4E3B\u4EBA\uFF08\u6B21\u65E5\u4F60\u53EA\u80FD\u968F\u4ED6\u6295\u7968\uFF09");
          if (!target) target = chooseRandomTarget(butler, false);
        }
        if (target) {
          butler.butlerMasterId = target.id;
          setPrivateInfo(butler, `\u4F60\u4ECA\u665A\u7684\u4F8D\u4ECE\u5BF9\u8C61\uFF1A${target.name}`);
          addReplayEvent(`\u7BA1\u5BB6\u9009\u62E9 ${butler.name} -> ${target.name}`, "night_action");
        } else {
          butler.butlerMasterId = "";
        }
      }
      if (undertaker && undertaker.alive && state.lastExecutedId) {
        const executed = state.players.find((p) => p.id === state.lastExecutedId);
        if (executed) {
          const registeredRole = registerRoleForInfo(executed, infoRegistrationMap);
          const result = await resolveInfoResult(
            undertaker,
            "\u9001\u846C\u8005\u4FE1\u606F",
            registeredRole,
            SCRIPT.roles.map((r) => r.name),
            { relatedNames: [executed.name] }
          );
          setPrivateInfo(undertaker, `\u9001\u846C\u8005\u4FE1\u606F\uFF1A${executed.name} \u662F ${result.info}`);
          recordInfoAudit(undertaker, "\u9001\u846C\u8005\u4FE1\u606F", registeredRole, result.info, result.isTrue, result.droisoned, result.source, result.reason);
          recordInfoDistortion(undertaker, "\u9001\u846C\u8005\u4FE1\u606F", registeredRole, result.info);
        }
      }
      if (spy && spy.alive) {
        const grimoire = state.players.map((p) => formatSpyGrimoireEntry(p)).join("\u3001");
        setPrivateInfo(spy, `\u9B54\u5178\uFF1A${grimoire}`);
        const auditEntries = (state.infoAudit || []).filter((entry) => entry.night === state.nightCount);
        if (auditEntries.length) {
          const auditText = auditEntries.map((entry) => {
            const status = entry.isTrue ? "\u6B63\u786E" : "\u9519\u8BEF";
            const tag = entry.droisoned ? "\uFF08\u9189\u9152/\u4E2D\u6BD2\uFF09" : "";
            return `${entry.player} ${entry.label} = ${entry.shownInfo}\uFF08\u771F\u5B9E\uFF1A${entry.trueInfo}\uFF0C${status}\uFF09${tag}`;
          }).join("\uFF1B");
          setPrivateInfo(spy, `\u4FE1\u606F\u5BA1\u8BA1\uFF1A${auditText}`);
        } else {
          setPrivateInfo(spy, "\u4FE1\u606F\u5BA1\u8BA1\uFF1A\u65E0");
        }
      }
      const storytellerPrompt = [
        {
          role: "system",
          content: "\u4F60\u662F\u8840\u67D3\u949F\u697C\u7684\u8BF4\u4E66\u4EBA\u3002\u8BF7\u8F93\u51FA JSON\uFF0C\u4E0D\u8981\u8F93\u51FA\u5176\u5B83\u5185\u5BB9\u3002narration \u8981\u6C42 2-3 \u53E5\u3001\u620F\u5267\u5316\u3001\u6697\u9ED1\u98CE\u683C\uFF0C\u4E0D\u6CC4\u9732\u4EFB\u4F55\u8EAB\u4EFD\u6216\u79C1\u5BC6\u4FE1\u606F\uFF1BpublicAnnouncement \u8981\u6C42\u4E00\u5C0F\u6BB5\u7B80\u77ED\u516C\u5F00\u4FE1\u606F\u3002"
        },
        {
          role: "user",
          content: `\u5F53\u524D\u5267\u672C\uFF1A\u6697\u6D41\u6D8C\u52A8\u3002
\u591C\u665A${state.nightCount}\u521A\u7ED3\u675F\u3002
\u4ECA\u665A\u6B7B\u4EA1\uFF1A${killed ? killed.name : "\u65E0\u4EBA"}\u3002
\u8BF7\u8F93\u51FA JSON\uFF1A
{"narration":"\u591C\u665A\u53D9\u8FF0","publicAnnouncement":"\u767D\u5929\u516C\u5F00\u4FE1\u606F"}`
        }
      ];
      let narration = "";
      let publicAnnouncement = "";
      try {
        const content = await callDeepSeek(storytellerPrompt, getTempValue());
        const json = extractJson(content);
        if (json) {
          narration = json.narration || "";
          publicAnnouncement = json.publicAnnouncement || "";
        } else {
          narration = content;
        }
      } catch (error) {
        narration = `\u591C\u665A\u7ED3\u675F\u3002${killed ? killed.name + " \u6B7B\u4EA1\u3002" : ""}`;
        publicAnnouncement = narration;
      }
      state.lastDawnNarration = narration || publicAnnouncement || "";
      if (narration) addChat("\u8BF4\u4E66\u4EBA", narration, "storyteller");
      if (publicAnnouncement) addChat("\u8BF4\u4E66\u4EBA", publicAnnouncement, "storyteller");
      addLogEntry(`\u591C\u665A\u6B7B\u4EA1\uFF1A${killed ? killed.name : "\u65E0\u4EBA"}`, "night");
      addReplayEvent(`\u591C\u665A\u6B7B\u4EA1\uFF1A${killed ? killed.name : "\u65E0\u4EBA"}`, "night_action");
      renderAll();
      checkWin();
      if (!state.ended) {
        switchPhase();
      }
    } catch (error) {
      console.error("[Night] resolveNight failed:", error);
      addChat("\u7CFB\u7EDF", `\u591C\u665A\u7ED3\u7B97\u5F02\u5E38\uFF1A${error?.message || error}\u3002\u5DF2\u5C1D\u8BD5\u7EE7\u7EED\u6D41\u7A0B\u3002`, "system");
      addLogEntry(`\u591C\u665A\u7ED3\u7B97\u5F02\u5E38\uFF1A${error?.message || error}`, "system");
      renderAll();
      if (state && state.started && !state.ended && state.phase === "night") {
        switchPhase();
      }
    }
  }

  // js/private-chat.js
  function getTempValue2() {
    const tempInput2 = document.getElementById("tempInput");
    return tempInput2 ? Number(tempInput2.value) || 1 : 1;
  }
  async function respondToPrivate(player, mentionText) {
    const privateInfo = formatPrivateInfoForPrompt(player, "chat", 4);
    const human = state.players.find((p) => p.isHuman);
    const privateChatHistory = formatPlayerPrivateChats(player);
    const evilChatHistory = formatEvilChatForPrompt(player);
    const recentChat = formatChatForPrompt(10, player, "chat");
    const aliveDeadSummary = getAliveDeadSummary();
    const buildPrompt = (extraInstruction = "") => buildPlayerPromptMessages(
      player,
      "chat",
      `\u516C\u5F00\u804A\u5929\uFF08\u6700\u8FD1\u589E\u91CF\uFF09\uFF1A
${recentChat}

\u4F60\u7684\u5168\u90E8\u79C1\u804A\u8BB0\u5F55\uFF1A
${privateChatHistory}
${evilChatHistory ? `
\u4F60\u7684\u90AA\u6076\u9635\u8425\u5BC6\u804A\u8BB0\u5F55\uFF1A
${evilChatHistory}
` : ""}
\u8FD9\u662F\u79C1\u804A\uFF0C\u53EA\u6709\u4F60\u548C\u5BF9\u65B9\u80FD\u770B\u5230\u3002${human ? human.name : "\u5BF9\u65B9"}\u5BF9\u4F60\u8BF4\uFF1A${mentionText}
${aliveDeadSummary}
\u4F60\u7684\u5F53\u524D\u72B6\u6001\uFF1A${player.alive ? "\u5B58\u6D3B" : "\u6B7B\u4EA1"}\u3002
\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\u589E\u91CF\uFF1A${privateInfo}
${extraInstruction ? `\u989D\u5916\u7EA6\u675F\uFF1A${extraInstruction}
` : ""}\u8BF7\u7528\u4E00\u5C0F\u6BB5\u8BDD\u79C1\u804A\u56DE\u5E94${human ? human.name : "\u5BF9\u65B9"}\uFF08\u6CE8\u610F\uFF1A\u8FD9\u4E0D\u662F\u516C\u5F00\u53D1\u8A00\uFF0C\u53EA\u6709\u5BF9\u65B9\u80FD\u770B\u5230\uFF09\u3002`
    );
    try {
      let usedPrompt = buildPrompt("");
      let content = await callDeepSeek(usedPrompt, getTempValue2(), player, "chat", false);
      let text = content.trim() || "\u6211\u6CA1\u4EC0\u4E48\u60F3\u8BF4\u7684\u3002";
      commitSessionMessages(player, "chat", usedPrompt, text);
      player.memory.push(text);
      addPrivateChat(player.name, human ? human.name : "\u4F60", text);
    } catch (error) {
      addPrivateChat("\u7CFB\u7EDF", player.name, `${player.name} \u672A\u80FD\u79C1\u804A\u56DE\u5E94\u3002`);
    }
  }
  async function aiPrivateReply(sender, target, text) {
    if (!state || !sender || !target) return;
    const privateInfo = formatPrivateInfoForPrompt(target, "chat", 4);
    const privateChatHistory = formatPlayerPrivateChats(target);
    const evilChatHistory = formatEvilChatForPrompt(target);
    const recentChat = formatChatForPrompt(8, target, "chat");
    const aliveDeadSummary = getAliveDeadSummary();
    const buildPrompt = (extraInstruction = "") => buildPlayerPromptMessages(
      target,
      "chat",
      `\u516C\u5F00\u804A\u5929\uFF08\u6700\u8FD1\u589E\u91CF\uFF09\uFF1A
${recentChat}

\u4F60\u7684\u5168\u90E8\u79C1\u804A\u8BB0\u5F55\uFF1A
${privateChatHistory}
${evilChatHistory ? `
\u4F60\u7684\u90AA\u6076\u9635\u8425\u5BC6\u804A\u8BB0\u5F55\uFF1A
${evilChatHistory}
` : ""}
\u8FD9\u662F\u79C1\u804A\uFF0C\u53EA\u6709\u4F60\u548C\u5BF9\u65B9\u80FD\u770B\u5230\u3002${sender.name}\u5BF9\u4F60\u8BF4\uFF1A${text}
${aliveDeadSummary}
\u4F60\u7684\u5F53\u524D\u72B6\u6001\uFF1A${target.alive ? "\u5B58\u6D3B" : "\u6B7B\u4EA1"}\u3002
\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\u589E\u91CF\uFF1A${privateInfo}
${extraInstruction ? `\u989D\u5916\u7EA6\u675F\uFF1A${extraInstruction}
` : ""}\u8BF7\u7528\u4E00\u5C0F\u6BB5\u8BDD\u79C1\u804A\u56DE\u5E94${sender.name}\uFF08\u6CE8\u610F\uFF1A\u8FD9\u4E0D\u662F\u516C\u5F00\u53D1\u8A00\uFF0C\u53EA\u6709\u5BF9\u65B9\u80FD\u770B\u5230\uFF09\u3002`
    );
    try {
      let usedPrompt = buildPrompt("");
      let content = await callDeepSeek(usedPrompt, getTempValue2(), target, "chat", false);
      let reply = content.trim() || "\u6211\u6CA1\u4EC0\u4E48\u60F3\u8BF4\u7684\u3002";
      commitSessionMessages(target, "chat", usedPrompt, reply);
      target.memory.push(reply);
      addPrivateChat(target.name, sender.name, reply);
    } catch (error) {
      addPrivateChat("\u7CFB\u7EDF", target.name, `${target.name} \u672A\u80FD\u79C1\u804A\u56DE\u5E94\u3002`);
    }
  }
  async function maybeAiPrivateChat(player) {
    if (!state || !player) return;
    if (state.paused) return;
    if (!isPrivateChatOpen()) return;
    if (state.dayCount !== 1 || state.phase !== "day" || state.dayStage !== "discussion") return;
    const candidates = state.players.filter((p) => p.alive && p.id !== player.id);
    if (!candidates.length) return;
    const privateInfo = formatPrivateInfoForPrompt(player, "json", 4);
    const privateChatHistory = formatPlayerPrivateChats(player);
    const evilChatHistory = formatEvilChatForPrompt(player);
    const recentChat = formatChatForPrompt(8, player, "json");
    const aliveDeadSummary = getAliveDeadSummary();
    const targetNames = candidates.map((p) => p.name).join("\u3001");
    const userContent = `\u516C\u5F00\u804A\u5929\uFF08\u6700\u8FD1\u589E\u91CF\uFF09\uFF1A
${recentChat}

        \u4F60\u7684\u79C1\u804A\u8BB0\u5F55\uFF1A
${privateChatHistory}
${evilChatHistory ? `
\u4F60\u7684\u90AA\u6076\u9635\u8425\u5BC6\u804A\u8BB0\u5F55\uFF1A
${evilChatHistory}
` : ""}
\u73B0\u5728\u662F\u767D\u59291\uFF0C\u4F60\u53EF\u4EE5\u9009\u62E9\u662F\u5426\u53D1\u8D77\u4E00\u6B21\u79C1\u804A\uFF08\u4EC5\u5728\u767D\u59291\u53EF\u79C1\u804A\uFF09\u3002
\u53EF\u79C1\u804A\u76EE\u6807\uFF1A${targetNames}\u3002
\u5982\u679C\u4F60\u662F\u90AA\u6076\u9635\u8425\uFF0C\u53EF\u4EE5\u8003\u8651\u901A\u8FC7\u79C1\u804A\u4E0E\u90AA\u6076\u540C\u4F34\u4EA4\u6362\u8EAB\u4EFD\u6216\u534F\u8C03\u8BA1\u5212\u3002
${aliveDeadSummary}
\u4F60\u7684\u5F53\u524D\u72B6\u6001\uFF1A${player.alive ? "\u5B58\u6D3B" : "\u6B7B\u4EA1"}\u3002
\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\u589E\u91CF\uFF1A${privateInfo}
\u8BF7\u8F93\u51FA JSON\uFF1A{"private":"yes|no","target":"\u73A9\u5BB6\u540D","message":"\u4E00\u5C0F\u6BB5\u8BDD"}`;
    const prompt2 = buildPlayerPromptMessages(player, "json", userContent, {
      systemPrompt: PLAYER_JSON_SYSTEM_PROMPT
    });
    try {
      const content = await callDeepSeek(prompt2, getTempValue2(), player, "json");
      const json = extractJson(content);
      if (!json || json.private !== "yes") return;
      const targetName = normalizeTargetName(json.target || "");
      const target = candidates.find((p) => p.name === targetName);
      if (!target) return;
      const text = (json.message || "").trim();
      if (!text) return;
      addPrivateChat(player.name, target.name, text);
      if (!target.isHuman) {
        await aiPrivateReply(player, target, text);
      }
    } catch (error) {
      return;
    }
  }

  // js/discussion.js
  function getTempValue3() {
    const tempInput2 = document.getElementById("tempInput");
    return tempInput2 ? Number(tempInput2.value) || 0.7 : 0.7;
  }
  async function aiDiscussionNextRound() {
    await advanceDiscussion();
  }
  async function aiDiscussionRound() {
    await advanceDiscussion();
  }
  async function runPostGameChatRound() {
    if (!state || !state.ended || !state.postGameChat) return;
    if (state.postGameInProgress) return;
    state.postGameInProgress = true;
    renderAll();
    const aiPlayers = state.players.filter((p) => !p.isHuman);
    for (const player of aiPlayers) {
      if (!state || !state.postGameChat || state.paused) break;
      const privateInfo = formatPrivateInfoForPrompt(player, "chat", 4);
      const privateChatHistory = formatPlayerPrivateChats(player);
      const recentChat = formatChatForPrompt(12, player, "chat");
      const aliveDeadSummary = getAliveDeadSummary();
      const userContent = `\u6E38\u620F\u5DF2\u7ED3\u675F\uFF0C\u8FDB\u5165\u8D5B\u540E\u804A\u5929\u3002\u4F60\u53EF\u4EE5\u7B80\u5355\u56DE\u987E\u8FD9\u4E00\u5C40\u6216\u8868\u8FBE\u611F\u53D7\u3002
\u516C\u5F00\u804A\u5929\uFF08\u6700\u8FD1\u589E\u91CF\uFF09\uFF1A
${recentChat}

          \u4F60\u7684\u79C1\u804A\u8BB0\u5F55\uFF1A
${privateChatHistory}

${aliveDeadSummary}
\u4F60\u7684\u5F53\u524D\u72B6\u6001\uFF1A${player.alive ? "\u5B58\u6D3B" : "\u6B7B\u4EA1"}\u3002
\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\u589E\u91CF\uFF1A${privateInfo}
\u8FD9\u662F\u516C\u5F00\u804A\u5929\uFF0C\u6240\u6709\u73A9\u5BB6\u90FD\u80FD\u770B\u5230\u4F60\u7684\u53D1\u8A00\u3002\u8BF7\u7528\u4E00\u5C0F\u6BB5\u8BDD\u53D1\u8A00\u3002`;
      const buildPrompt = buildPlayerPromptMessages(player, "chat", userContent);
      try {
        const content = await callDeepSeek(buildPrompt, getTempValue3(), player, "chat");
        const text = content.trim() || "\u6211\u6CA1\u4EC0\u4E48\u60F3\u8BF4\u7684\u3002";
        player.memory.push(text);
        addChat(player.name, text, "player");
      } catch (error) {
        addChat("\u7CFB\u7EDF", `${player.name} \u53D1\u8A00\u5931\u8D25\u3002`, "system");
      }
    }
    state.postGameInProgress = false;
    renderAll();
  }
  function findMentions(text) {
    const mentions = [];
    state.players.forEach((player) => {
      if (player.isHuman) return;
      if (text.includes(`@${player.name}`)) {
        mentions.push(player);
      }
    });
    return mentions;
  }
  async function respondToMention(player, mentionText) {
    const privateInfo = formatPrivateInfoForPrompt(player, "chat", 4);
    const privateChatHistory = formatPlayerPrivateChats(player);
    const recentChat = formatChatForPrompt(12, player, "chat");
    const dayRuleNote = getDayRuleNote();
    const aliveDeadSummary = getAliveDeadSummary();
    const buildPrompt = (extraInstruction = "") => buildPlayerPromptMessages(
      player,
      "chat",
      `\u516C\u5F00\u804A\u5929\uFF08\u6700\u8FD1\u589E\u91CF\uFF09\uFF1A
${recentChat}

          \u4F60\u7684\u79C1\u804A\u8BB0\u5F55\uFF1A
${privateChatHistory}

\u4F60\u88AB@\u63D0\u95EE\u4E86\u3002\u63D0\u95EE\u5185\u5BB9\uFF1A${mentionText}
${aliveDeadSummary}
\u4F60\u7684\u5F53\u524D\u72B6\u6001\uFF1A${player.alive ? "\u5B58\u6D3B" : "\u6B7B\u4EA1"}\u3002
\u65F6\u95F4\u89C4\u5219\uFF1A${dayRuleNote || "\u65E0"}
${state.phase === "day" && state.dayStage === "discussion" && !state.ended ? `\u730E\u624B\u58F0\u660E\u89C4\u5219\uFF1A\u82E5\u8981\u89E6\u53D1\u5F00\u67AA\uFF0C\u6574\u53E5\u5FC5\u987B\u4E25\u683C\u4E3A"${SLAYER_DECLARATION_TEMPLATE}"\u3002
` : ""}\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\u589E\u91CF\uFF1A${privateInfo}
${extraInstruction ? `\u989D\u5916\u7EA6\u675F\uFF1A${extraInstruction}
` : ""}\u8FD9\u662F\u516C\u5F00\u804A\u5929\uFF0C\u6240\u6709\u73A9\u5BB6\u90FD\u80FD\u770B\u5230\u4F60\u7684\u53D1\u8A00\u3002\u8BF7\u7ED9\u51FA\u4E00\u5C0F\u6BB5\u56DE\u5E94\u3002`
    );
    try {
      let usedPrompt = buildPrompt("");
      let content = await callDeepSeek(usedPrompt, Number(document.getElementById("tempInput")?.value) || 1, player, "chat", false);
      let text = content.trim() || "\u6211\u6CA1\u4EC0\u4E48\u60F3\u8BF4\u7684\u3002";
      commitSessionMessages(player, "chat", usedPrompt, text);
      player.memory.push(text);
      addChat(player.name, text, "player");
    } catch (error) {
      const reason = error?.message ? `\uFF08${String(error.message).slice(0, 120)}\uFF09` : "";
      addChat("\u7CFB\u7EDF", `${player.name} \u672A\u80FD\u56DE\u5E94${reason}\u3002`, "system");
    }
  }
  async function aiSpeak(player) {
    if (state && state.paused) return;
    const token = state.discussionToken || 0;
    const privateInfo = formatPrivateInfoForPrompt(player, "chat", 4);
    const privateChatHistory = formatPlayerPrivateChats(player);
    const evilChatHistory = formatEvilChatForPrompt(player);
    const recentChat = formatChatForPrompt(12, player, "chat");
    const dayRuleNote = getDayRuleNote();
    const aliveDeadSummary = getAliveDeadSummary();
    const buildPrompt = (extraInstruction = "") => buildPlayerPromptMessages(
      player,
      "chat",
      `\u516C\u5F00\u804A\u5929\uFF08\u6700\u8FD1\u589E\u91CF\uFF09\uFF1A
${recentChat}

          \u4F60\u7684\u79C1\u804A\u8BB0\u5F55\uFF1A
${privateChatHistory}
${evilChatHistory ? `
\u4F60\u7684\u90AA\u6076\u9635\u8425\u5BC6\u804A\u8BB0\u5F55\uFF1A
${evilChatHistory}
` : ""}
${aliveDeadSummary}
\u4F60\u7684\u5F53\u524D\u72B6\u6001\uFF1A${player.alive ? "\u5B58\u6D3B" : "\u6B7B\u4EA1"}\u3002
\u65F6\u95F4\u89C4\u5219\uFF1A${dayRuleNote || "\u65E0"}
\u730E\u624B\u58F0\u660E\u89C4\u5219\uFF1A\u82E5\u8981\u89E6\u53D1\u5F00\u67AA\uFF0C\u6574\u53E5\u5FC5\u987B\u4E25\u683C\u4E3A"${SLAYER_DECLARATION_TEMPLATE}"\u3002
\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\u589E\u91CF\uFF1A${privateInfo}
${extraInstruction ? `\u989D\u5916\u7EA6\u675F\uFF1A${extraInstruction}
` : ""}\u8FD9\u662F\u516C\u5F00\u804A\u5929\uFF0C\u6240\u6709\u73A9\u5BB6\u90FD\u80FD\u770B\u5230\u4F60\u7684\u53D1\u8A00\u3002\u53EA\u57FA\u4E8E\u4EE5\u4E0A\u4FE1\u606F\u8FDB\u884C**\u516C\u804A**\u53D1\u8A00\u3002\u8BF7\u8F93\u51FA\u4E00\u5C0F\u6BB5\u8BDD\u8FDB\u884C\u516C\u804A\u53D1\u8A00\u3002`
    );
    try {
      let usedPrompt = buildPrompt("");
      let content = await callDeepSeek(usedPrompt, getTempValue3(), player, "chat", false);
      if (!state || !state.started || state.phase !== "day" || state.dayStage !== "discussion" || state.discussionToken !== token || state.paused) {
        return;
      }
      let text = content.trim();
      if (!state || !state.started || state.phase !== "day" || state.dayStage !== "discussion" || state.discussionToken !== token || state.paused) {
        return;
      }
      if (!text) text = "\u6211\u6CA1\u4EC0\u4E48\u60F3\u8BF4\u7684\u3002";
      commitSessionMessages(player, "chat", usedPrompt, text);
      player.memory.push(text);
      addChat(player.name, text, "player");
      maybeAiPrivateChat(player);
    } catch (error) {
      const reason = error?.message ? `\uFF08${String(error.message).slice(0, 120)}\uFF09` : "";
      addChat("\u7CFB\u7EDF", `${player.name} \u53D1\u8A00\u5931\u8D25${reason}\u3002`, "system");
    }
  }
  async function advanceDiscussion() {
    if (!state.started || state.phase !== "day" || state.dayStage !== "discussion") return;
    if (state.paused) return;
    const total = state.discussionOrder.length;
    if (!total) {
      enterNomination();
      return;
    }
    while (true) {
      if (state.discussionCursor >= total) {
        state.discussionCursor = 0;
      }
      const nextId = state.discussionOrder[state.discussionCursor];
      state.discussionCursor += 1;
      const player = state.players.find((p) => p.id === nextId);
      if (!player) {
        continue;
      }
      state.currentSpeakerId = nextId;
      renderStatus();
      if (player.isHuman) {
        return;
      }
      await aiSpeak(player);
      if (!state || !state.started || state.phase !== "day" || state.dayStage !== "discussion" || state.paused) {
        return;
      }
    }
  }
  async function runEvilInternalChat() {
    const evilPlayers = state.players.filter(
      (p) => p.alive && (p.team === "minion" || p.team === "demon")
    );
    if (evilPlayers.length < 2) return;
    state.evilChatPhase = true;
    renderAll();
    state.evilChat = [];
    const msgCount = {};
    evilPlayers.forEach((p) => {
      msgCount[p.id] = 0;
    });
    const maxPerPlayer = 3;
    const maxRounds = 3;
    for (let round = 0; round < maxRounds; round++) {
      let anyoneSpoke = false;
      for (const player of evilPlayers) {
        if (state.ended || state.paused) {
          state.evilChatPhase = false;
          return;
        }
        if (msgCount[player.id] >= maxPerPlayer) continue;
        if (player.isHuman) {
          const text = await requestHumanStatement(
            `\u90AA\u6076\u5BC6\u804A\uFF08\u7B2C${round + 1}\u8F6E\uFF0C\u5269\u4F59${maxPerPlayer - msgCount[player.id]}\u6B21\uFF09`,
            ""
          );
          if (text) {
            addEvilChat(player.name, text);
            msgCount[player.id]++;
            anyoneSpoke = true;
          }
          continue;
        }
        const evilHistory = formatEvilChatForPrompt(player);
        const privateInfo = formatPrivateInfoForPrompt(player, "evil", 4);
        const evilNames = evilPlayers.map((p) => `${p.name}(${p.team === "demon" ? "\u6076\u9B54" : "\u722A\u7259"})`).join("\u3001");
        const prompt2 = buildPlayerPromptMessages(
          player,
          "evil",
          `\u73B0\u5728\u662F\u767D\u59291\u5F00\u59CB\u524D\u7684\u90AA\u6076\u9635\u8425\u5BC6\u804A\u73AF\u8282\u3002\u53EA\u6709\u90AA\u6076\u9635\u8425\u6210\u5458\u80FD\u770B\u5230\u8FD9\u4E9B\u6D88\u606F\u3002
\u90AA\u6076\u9635\u8425\u6210\u5458\uFF1A${evilNames}
\u4F60\u7684\u79C1\u5BC6\u4FE1\u606F\uFF1A${privateInfo}
${evilHistory ? `\u5F53\u524D\u5BC6\u804A\u8BB0\u5F55\uFF1A
${evilHistory}` : "\uFF08\u5C1A\u65E0\u53D1\u8A00\uFF09"}
\u4F60\u8FD8\u5269 ${maxPerPlayer - msgCount[player.id]} \u6B21\u53D1\u8A00\u673A\u4F1A\u3002
\u8BF7\u7528\u4E00\u5C0F\u6BB5\u8BDD\u4E0E\u90AA\u6076\u540C\u4F34\u4EA4\u6D41\u7B56\u7565\uFF08\u5982\uFF1A\u8BA8\u8BBA\u8C01\u6765\u5047\u626E\u4EC0\u4E48\u8EAB\u4EFD\u3001\u5982\u4F55\u5206\u6563\u5584\u826F\u9635\u8425\u6CE8\u610F\u529B\u3001\u534F\u8C03\u53D1\u8A00\u53E3\u5F84\u7B49\uFF09\u3002`
        );
        try {
          const content = await callDeepSeek(prompt2, getTempValue3(), player, "evil", false);
          const text = (content || "").trim();
          if (text) {
            addEvilChat(player.name, text);
            msgCount[player.id]++;
            anyoneSpoke = true;
          }
        } catch (_) {
        }
      }
      if (!anyoneSpoke) break;
    }
    state.evilChatPhase = false;
    renderAll();
  }
  async function startDiscussion2(auto = true) {
    if (state && state.paused) return;
    resetDiscussion();
    if (state.dayCount === 1) {
      await runEvilInternalChat();
      if (state.ended || state.paused) return;
    }
    const duration = getDiscussionDurationSeconds();
    state.discussionDurationSeconds = duration;
    state.discussionMaxRemaining = duration;
    state.lastDiscussionAt = Date.now();
    startDayDiscussionTimer(true);
    addChat("\u8BF4\u4E66\u4EBA", "\u767D\u5929\u8BA8\u8BBA\u5F00\u59CB\u3002", "storyteller");
    addLogEntry("\u8FDB\u5165\u8BA8\u8BBA\u9636\u6BB5", "phase");
    renderAll();
    if (auto) {
      await advanceDiscussion();
    }
  }
  function resetDiscussion() {
    state.dayStage = "discussion";
    state.discussionOrder = state.players.map((p) => p.id);
    const firstAiIndex = state.discussionOrder.findIndex((id) => {
      const player = state.players.find((p) => p.id === id);
      return player && !player.isHuman;
    });
    state.discussionCursor = firstAiIndex === -1 ? 0 : firstAiIndex;
    state.discussionPassed = [];
    state.currentSpeakerId = "";
    state.discussionToken = (state.discussionToken || 0) + 1;
    state.lastDiscussionAt = Date.now();
    state.nominationCountdown = 0;
    const duration = getDiscussionDurationSeconds();
    state.discussionDurationSeconds = duration;
    state.discussionMaxRemaining = duration;
  }
  async function requestHumanStatement(title, fallback = "\u6211\u6CA1\u4EC0\u4E48\u60F3\u8BF4\u7684\u3002") {
    const promptText = title ? `${title}
\uFF08\u53EF\u7559\u7A7A\u8DF3\u8FC7\uFF09` : "\u8BF7\u8F93\u5165\uFF1A";
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const supportsVoice = Boolean(SpeechRecognition);
    if (supportsVoice) {
      const wantVoice = window.confirm(`${promptText}

\u70B9"\u786E\u5B9A"\u4F7F\u7528\u8BED\u97F3\u8F93\u5165\uFF0C\u70B9"\u53D6\u6D88"\u624B\u52A8\u8F93\u5165\u3002`);
      if (wantVoice) {
        const spoken = await captureSpeechForStatement(title);
        updateVoiceUi("");
        if (spoken) {
          const reviewed = window.prompt(`${promptText}
\uFF08\u5DF2\u8BC6\u522B\uFF0C\u53EF\u76F4\u63A5\u786E\u8BA4\u6216\u4FEE\u6539\uFF09`, spoken);
          if (reviewed === null) return spoken || fallback;
          const reviewedTrimmed = reviewed.trim();
          return reviewedTrimmed || fallback;
        }
      }
    }
    updateVoiceUi("");
    const input = window.prompt(promptText, "");
    if (input === null) return fallback;
    const trimmed = input.trim();
    return trimmed || fallback;
  }

  // js/bgm.js
  var audio = document.getElementById("bgmAudio");
  var panel = document.getElementById("bgmPanel");
  var toggleBtn = document.getElementById("bgmToggleBtn");
  var closeBtn = document.getElementById("bgmPanelCloseBtn");
  var playPauseBtn = document.getElementById("bgmPlayPauseBtn");
  var trackLabel = document.getElementById("bgmTrackLabel");
  var volumeSlider = document.getElementById("bgmVolumeSlider");
  var tracks = document.querySelectorAll(".bgm-track");
  var categoryEls = document.querySelectorAll(".bgm-category");
  var currentTrack = null;
  var isPlaying = false;
  var lastAutoCategory = "";
  var pendingAutoRetry = false;
  var voicePausedBgm = false;
  var tracksByCategory = {};
  categoryEls.forEach((categoryEl) => {
    const key = String(categoryEl.dataset.bgmKey || "").trim();
    if (!key) return;
    tracksByCategory[key] = Array.from(categoryEl.querySelectorAll(".bgm-track"));
  });
  audio.volume = parseFloat(volumeSlider.value);
  function isIntroBlockingBgm() {
    const introOverlay3 = document.getElementById("introOverlay");
    return document.body.classList.contains("prestart") || Boolean(introOverlay3 && introOverlay3.classList.contains("show"));
  }
  function pauseBgmForVoice() {
    if (!audio || !audio.src) {
      voicePausedBgm = false;
      return;
    }
    if (!audio.paused && !audio.ended) {
      voicePausedBgm = true;
      audio.pause();
    } else {
      voicePausedBgm = false;
    }
  }
  function resumeBgmAfterVoice() {
    if (!audio) return;
    if (!voicePausedBgm) return;
    voicePausedBgm = false;
    if (audio.src) {
      audio.play().catch(() => {
        scheduleAutoRetry();
      });
    }
  }
  function setActiveTrack(el) {
    tracks.forEach((t) => t.classList.remove("active", "paused"));
    if (el) {
      el.classList.add("active");
      const name = el.querySelector(".bgm-track-name").textContent;
      const meta = el.querySelector(".bgm-track-meta").textContent;
      trackLabel.textContent = name;
      trackLabel.classList.add("visible");
      playPauseBtn.classList.add("visible");
      volumeSlider.classList.add("visible");
    }
  }
  function trackSrcMatches(src) {
    const cur = String(audio.src || "");
    if (!cur) return false;
    return decodeURIComponent(cur).endsWith(src);
  }
  function scheduleAutoRetry() {
    if (pendingAutoRetry) return;
    pendingAutoRetry = true;
    const retry = () => {
      pendingAutoRetry = false;
      document.removeEventListener("pointerdown", retry, true);
      document.removeEventListener("keydown", retry, true);
      if (typeof window.syncAutoBgmForState === "function") {
        window.syncAutoBgmForState({ force: true });
      }
    };
    document.addEventListener("pointerdown", retry, true);
    document.addEventListener("keydown", retry, true);
  }
  function playTrack(el, options = {}) {
    if (!el) return;
    const { toggleIfSame = true, auto = false } = options;
    const src = el.dataset.src;
    if (!src) return;
    if (currentTrack === el && trackSrcMatches(src)) {
      if (!toggleIfSame) {
        if (!isPlaying) {
          audio.play().catch(() => {
            if (auto) scheduleAutoRetry();
          });
        }
        setActiveTrack(el);
        return;
      }
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(() => {
          if (auto) scheduleAutoRetry();
        });
      }
      return;
    }
    currentTrack = el;
    audio.src = src;
    setActiveTrack(el);
    audio.play().catch(() => {
      if (auto) scheduleAutoRetry();
    });
  }
  function getAliveCount() {
    if (!state || !Array.isArray(state.players)) return 0;
    return state.players.filter((p) => p && p.alive).length;
  }
  function getCategoryByState() {
    if (!state || !state.started) return "opening";
    if (state.ended) return "ending";
    if (state.phase === "night") return "night";
    if (getAliveCount() <= 4) return "finale";
    if (state.phase === "day" && state.dayStage === "nomination") return "reasoning";
    return "discussion";
  }
  function pickRandomTrack(pool) {
    if (!Array.isArray(pool) || !pool.length) return null;
    if (pool.length === 1) return pool[0];
    const candidates = currentTrack ? pool.filter((t) => t !== currentTrack) : pool.slice();
    const list = candidates.length ? candidates : pool;
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  }
  function syncAutoBgmForState(options = {}) {
    const { force = false } = options;
    if (isIntroBlockingBgm()) return;
    const category = getCategoryByState();
    if (!force && category === lastAutoCategory) return;
    const pool = tracksByCategory[category];
    if (!pool || !pool.length) return;
    const selected = pickRandomTrack(pool);
    if (!selected) return;
    lastAutoCategory = category;
    playTrack(selected, { toggleIfSame: false, auto: true });
  }
  function updatePlayPauseBtn() {
    playPauseBtn.textContent = isPlaying ? "\u23F8" : "\u25B6";
    if (currentTrack) {
      if (isPlaying) {
        currentTrack.classList.remove("paused");
      } else {
        currentTrack.classList.add("paused");
      }
    }
  }
  audio.addEventListener("play", () => {
    isPlaying = true;
    updatePlayPauseBtn();
  });
  audio.addEventListener("pause", () => {
    isPlaying = false;
    updatePlayPauseBtn();
  });
  tracks.forEach((track) => {
    track.addEventListener("click", () => {
      playTrack(track, { toggleIfSame: true, auto: false });
    });
  });
  toggleBtn.addEventListener("click", () => {
    panel.classList.toggle("open");
  });
  closeBtn.addEventListener("click", () => {
    panel.classList.remove("open");
  });
  playPauseBtn.addEventListener("click", () => {
    if (!audio.src) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
      });
    }
  });
  volumeSlider.addEventListener("input", () => {
    audio.volume = parseFloat(volumeSlider.value);
  });
  document.addEventListener("click", (e) => {
    if (panel.classList.contains("open") && !panel.contains(e.target) && !document.getElementById("bgmBar").contains(e.target)) {
      panel.classList.remove("open");
    }
  });
  syncAutoBgmForState({ force: true });
  window.syncAutoBgmForState = syncAutoBgmForState;
  window.pauseBgmForVoice = pauseBgmForVoice;
  window.resumeBgmAfterVoice = resumeBgmAfterVoice;

  // js/main.js
  initDomRefs();
  setNormalizeDeps({ syncUnreadChatCount });
  setUiDeps({
    renderChat,
    renderPrivateChat,
    renderReplay,
    updatePrivateChatControls,
    updateHeaderPhase,
    needsHumanNightAction,
    isHumanActionReady,
    scheduleAutoNight,
    getTimelineIcon,
    useSlayerShot,
    applyDiscussionDrawers,
    scheduleChatRelock,
    canUseVoiceInput: canUseVoiceInput2,
    updatePauseButton: updatePauseButton2
  });
  setResolveNight(resolveNight2);
  setStartDiscussion(startDiscussion2);
  setGetModelStartupReadiness(getModelStartupReadiness);
  setGetDiscussionDurationSeconds(getDiscussionDurationSeconds);
  setPromptDeps({ startDayDiscussionTimer, renderStatus });
  setChatDeps({ getPhaseLabel, renderLog, renderPublicLog, maybeHandleSlayerClaim });
  window.renderSeatCircle = renderSeatCircle2;
  window.ROLE_STRATEGY_TIPS = ROLE_STRATEGY_TIPS;
  window.canUseVoiceInput = canUseVoiceInput2;
  initNotePicker();
  initScriptBoard();
  modelSelect.addEventListener("change", () => {
    localStorage.setItem(MODEL_STORAGE, modelSelect.value);
  });
  var loadModelCatalogBtn = document.getElementById("loadModelCatalogBtn");
  var modelCatalogFileInput = document.getElementById("modelCatalogFileInput");
  if (loadModelCatalogBtn && modelCatalogFileInput) {
    loadModelCatalogBtn.addEventListener("click", () => modelCatalogFileInput.click());
    modelCatalogFileInput.addEventListener("change", () => {
      const file = modelCatalogFileInput.files && modelCatalogFileInput.files[0];
      if (!file) return;
      const fr = new FileReader();
      fr.onload = () => {
        const text = fr.result;
        if (loadModelCatalogFromText(text)) {
          if (typeof alert === "function") alert("\u5DF2\u52A0\u8F7D\u6A21\u578B\u914D\u7F6E\uFF1A" + file.name);
        }
        modelCatalogFileInput.value = "";
      };
      fr.readAsText(file, "UTF-8");
    });
  }
  if (modelHealthRefreshBtn) {
    modelHealthRefreshBtn.addEventListener("click", async () => {
      modelHealthRefreshBtn.disabled = true;
      try {
        await autoLoadModelCatalog();
      } finally {
        modelHealthRefreshBtn.disabled = false;
      }
    });
  }
  function populateApiKeyInputs() {
    const saved3 = loadLocalApiKeys();
    const names = getKnownApiKeyNames();
    names.forEach((name) => {
      const input = document.getElementById(`apiKey_${name}`);
      if (input && saved3[name]) input.value = saved3[name];
    });
  }
  function collectApiKeyInputs() {
    const names = getKnownApiKeyNames();
    const keys = {};
    names.forEach((name) => {
      const input = document.getElementById(`apiKey_${name}`);
      if (input && input.value.trim()) keys[name] = input.value.trim();
    });
    return keys;
  }
  if (saveApiKeysBtn) {
    saveApiKeysBtn.addEventListener("click", () => {
      const keys = collectApiKeyInputs();
      reapplyApiKeysFromUI(keys);
      const count = Object.keys(keys).length;
      if (typeof window.alert === "function") {
        alert(count ? `\u5DF2\u4FDD\u5B58 ${count} \u4E2A\u5BC6\u94A5\u5E76\u5237\u65B0\u6A21\u578B\u914D\u7F6E\u3002` : "\u672A\u586B\u5199\u4EFB\u4F55\u5BC6\u94A5\u3002");
      }
    });
  }
  if (clearApiKeysBtn) {
    clearApiKeysBtn.addEventListener("click", () => {
      const names = getKnownApiKeyNames();
      names.forEach((name) => {
        const input = document.getElementById(`apiKey_${name}`);
        if (input) input.value = "";
      });
      clearLocalApiKeys();
      reapplyApiKeysFromUI({});
      if (typeof window.alert === "function") {
        alert("\u5DF2\u6E05\u9664\u5168\u90E8\u5BC6\u94A5\u3002");
      }
    });
  }
  if (apiKeysSection) {
    apiKeysSection.addEventListener("click", (e) => {
      const btn = e.target.closest(".api-key-toggle");
      if (!btn) return;
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
    });
  }
  autoNightToggle.addEventListener("change", () => {
    localStorage.setItem(AUTO_NIGHT_STORAGE, autoNightToggle.checked ? "1" : "0");
    scheduleAutoNight();
  });
  if (trajectoryToggle) {
    trajectoryToggle.addEventListener("change", () => {
      const enabled = trajectoryToggle.checked;
      localStorage.setItem(TRAJECTORY_STORAGE, enabled ? "1" : "0");
      if (state) {
        state.recordTrajectories = enabled;
        if (enabled && !Array.isArray(state.trajectoryLog)) {
          state.trajectoryLog = [];
        }
      }
    });
  }
  if (voiceBtn2) {
    voiceBtn2.addEventListener("click", toggleVoiceInput);
  }
  if (playerCountInput) {
    playerCountInput.addEventListener("input", () => {
      if (!state || !state.started) {
        renderConfigSummary();
      }
    });
  }
  if (dayDiscussionMinutesInput) {
    dayDiscussionMinutesInput.addEventListener("change", () => {
      const minutes = Number(dayDiscussionMinutesInput.value);
      if (!Number.isFinite(minutes)) return;
      applyDiscussionMinutes(minutes, true);
    });
  }
  humanSeatInput.addEventListener("input", () => {
    const name = humanNameInput.value.trim();
    if (/^玩家\d*$/.test(name)) {
      humanNameInput.value = `\u73A9\u5BB6${humanSeatInput.value}`;
    }
  });
  setupBtn.addEventListener("click", setupPlayers);
  assignBtn.addEventListener("click", () => {
    assignRoles();
    if (state && state.players && state.players.some((p) => p.roleId)) {
      closeSettingsDrawer();
    }
  });
  startBtn.addEventListener("click", startGame);
  randomModelBtn.addEventListener("click", randomizeAiModels);
  pauseBtn.addEventListener("click", togglePause);
  nightResolveBtn.addEventListener("click", resolveNight2);
  aiTalkBtn.addEventListener("click", () => {
    if (state && state.ended && state.postGameChat) {
      runPostGameChatRound();
      return;
    }
    aiDiscussionRound();
  });
  voteBtn.addEventListener("click", runVote);
  if (storySummaryBtn) {
    storySummaryBtn.addEventListener("click", () => generateStorySummary({ force: true }));
  }
  modalCloseBtn.addEventListener("click", hideModal);
  nominateBtn.addEventListener("click", async () => {
    if (!state || !state.started || state.ended) return;
    if (state.phase !== "day" || state.dayStage !== "nomination") return;
    if (state.nominationPhase !== "open") return;
    if (state.dayNominationCount >= MAX_NOMINATIONS_PER_DAY) {
      addChat("\u7CFB\u7EDF", `\u4ECA\u65E5\u63D0\u540D\u5DF2\u8FBE\u4E0A\u9650\uFF08${MAX_NOMINATIONS_PER_DAY}\u6B21\uFF09\u3002`, "system");
      finalizeDayExecution();
      return;
    }
    const human = state.players.find((p) => p.isHuman);
    if (!human) return;
    if (state.nominationUsedIds.includes(human.id)) {
      addChat("\u7CFB\u7EDF", "\u4F60\u672C\u56DE\u5408\u5DF2\u7ECF\u63D0\u540D\u8FC7\u4E86\u3002", "system");
      return;
    }
    const nomineeId = nomineeSelect.value;
    if (!nomineeId) return;
    if (state.nomineeUsedIds.includes(nomineeId)) {
      addChat("\u7CFB\u7EDF", "\u8BE5\u73A9\u5BB6\u672C\u56DE\u5408\u5DF2\u88AB\u63D0\u540D\u3002", "system");
      return;
    }
    state.nominationUsedIds.push(human.id);
    state.nomineeUsedIds.push(nomineeId);
    state.humanNominationDone = true;
    state.currentSpeakerId = "";
    await startNominationResolution(human.id, nomineeId, "");
  });
  skipNominationBtn.addEventListener("click", async () => {
    if (!state || !state.started || state.ended) return;
    if (state.phase !== "day" || state.dayStage !== "nomination") return;
    if (state.nominationPhase !== "open") return;
    const human = state.players.find((p) => p.isHuman);
    if (!human) return;
    state.nominationUsedIds.push(human.id);
    addChat("\u7CFB\u7EDF", `${human.name} \u8DF3\u8FC7\u63D0\u540D\u3002`, "system");
    addReplayEvent(`${human.name} \u8DF3\u8FC7\u63D0\u540D`, "day_action");
    state.humanNominationDone = true;
    state.currentSpeakerId = "";
    maybeStartNextNomination();
  });
  voteYesBtn.addEventListener("click", async () => {
    if (!state || !state.started || state.ended) return;
    if (state.phase !== "day" || state.dayStage !== "nomination") return;
    if (state.nominationPhase !== "voting") return;
    const human = state.players.find((p) => p.isHuman);
    if (!human || state.currentVoterId !== human.id) return;
    if (!human.alive && human.deadVoteUsed) {
      addChat("\u7CFB\u7EDF", "\u9057\u8A00\u7968\u5DF2\u4F7F\u7528\uFF0C\u4E0D\u80FD\u518D\u6295\u8D5E\u6210\u3002", "system");
      return;
    }
    clearVoteTimer();
    recordVote(human, "yes", "");
    state.humanVoted = true;
    renderAll();
    maybeFinalizeVotes();
  });
  voteNoBtn.addEventListener("click", async () => {
    if (!state || !state.started || state.ended) return;
    if (state.phase !== "day" || state.dayStage !== "nomination") return;
    if (state.nominationPhase !== "voting") return;
    const human = state.players.find((p) => p.isHuman);
    if (!human || state.currentVoterId !== human.id) return;
    clearVoteTimer();
    recordVote(human, "no", "");
    state.humanVoted = true;
    renderAll();
    maybeFinalizeVotes();
  });
  window.addEventListener("keydown", (event) => {
    if (!state || !state.started || state.ended || state.paused) return;
    if (event.isComposing) return;
    const target = event.target;
    const editable = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
    if (editable) return;
    if (state.phase !== "day" || state.dayStage !== "nomination" || state.nominationPhase !== "voting") return;
    const key = String(event.key || "").toLowerCase();
    if (key === "y") {
      if (!voteYesBtn.disabled) {
        event.preventDefault();
        voteYesBtn.click();
      }
    } else if (key === "n") {
      if (!voteNoBtn.disabled) {
        event.preventDefault();
        voteNoBtn.click();
      }
    }
  });
  forceNominationBtn.addEventListener("click", () => {
    if (!state || !state.started || state.ended) return;
    if (state.phase !== "day" || state.dayStage !== "discussion") return;
    enterNomination();
  });
  endBtn.addEventListener("click", endGame);
  resetBtn.addEventListener("click", () => {
    if (!confirm("\u786E\u8BA4\u91CD\u7F6E\uFF1F")) return;
    localStorage.removeItem(STORAGE_KEY);
    setState(null);
    clearNominationTimers();
    clearVoteTimer();
    clearDayDiscussionTimer();
    clearAutoNightTimer();
    document.body.classList.remove("phase-night", "phase-day", "phase-dusk");
    chatBox.innerHTML = "";
    playerList.innerHTML = "";
    logList.innerHTML = "";
    if (privateChatBox) privateChatBox.innerHTML = "";
    if (publicLogList) publicLogList.innerHTML = "";
    if (publicLogDrawerList) publicLogDrawerList.innerHTML = "";
    if (chatSearchInput) chatSearchInput.value = "";
    if (chatResultHint) chatResultHint.textContent = "";
    if (chatJumpLatestBtn) chatJumpLatestBtn.classList.remove("visible");
    if (chatAutoScrollBtn) chatAutoScrollBtn.textContent = "\u8DDF\u968F\u65B0\u6D88\u606F\uFF1A\u5F00";
    if (townLayoutEl) {
      townLayoutEl.classList.remove("discussion-focus", "show-town-left", "show-public-log", "overlay-open");
    }
    if (peekTownBtn) peekTownBtn.textContent = "\u5E7F\u573A";
    if (peekLogBtn) peekLogBtn.textContent = "\u8BB0\u5F55";
    resetSeatCircleView();
    humanRoleBox.textContent = "\u5C1A\u672A\u5206\u914D\u89D2\u8272";
    humanPrivateBox.textContent = "\u6682\u65E0";
    humanActionBox.textContent = "\u65E0\u591C\u665A\u884C\u52A8";
    phaseStatus.textContent = "\u672A\u5F00\u5C40";
    renderConfigSummary();
    renderTokenUsageDisplay2();
    renderTaskCardStatus();
    updateHeaderPhase();
    if (typeof window.syncAutoBgmForState === "function") {
      window.syncAutoBgmForState({ force: true });
    }
    if (typeof window.ttsClearQueue === "function") {
      window.ttsClearQueue();
    }
  });
  exportBtn.addEventListener("click", exportJson);
  if (exportTrajBtn) {
    exportTrajBtn.addEventListener("click", exportTrajectories);
  }
  if (enterGameBtn) {
    enterGameBtn.addEventListener("click", startIntroPlayback);
  }
  if (skipIntroBtn) {
    skipIntroBtn.addEventListener("click", finishIntroPlayback);
  }
  if (introVideo2) {
    introVideo2.addEventListener("ended", finishIntroPlayback);
    introVideo2.addEventListener("error", finishIntroPlayback);
  }
  sendBtn.addEventListener("click", async () => {
    if (!state || !state.started) return;
    if (state.dayStage === "nomination" && !state.postGameChat) return;
    const text = humanInput2.value.trim();
    if (!text) return;
    const human = state.players.find((p) => p.isHuman);
    addChat(human.name, text, "player");
    state.lastHumanChatAt = Date.now();
    human.memory.push(text);
    humanInput2.value = "";
    addLogEntry(`\u73A9\u5BB6\u53D1\u8A00\uFF1A${text}`, "chat", { player: human.name });
    const mentions = findMentions(text).filter((p) => state.postGameChat ? true : p.alive);
    if (mentions.length) {
      await waitHumanChatGrace();
      for (let i = 0; i < mentions.length; i += 1) {
        if (!state || state.paused || state.ended) break;
        await respondToMention(mentions[i], text);
        if (i < mentions.length - 1) {
          await sleep(260);
        }
      }
    }
    if (state.ended) {
      return;
    }
    if (state.phase === "day" && state.dayStage === "discussion") {
      if (!mentions.length) {
        await waitHumanChatGrace();
        await aiDiscussionNextRound();
      }
    }
  });
  if (humanInput2) {
    humanInput2.addEventListener("keydown", (event) => {
      if (event.isComposing) return;
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendBtn.click();
      }
    });
  }
  mentionBtn.addEventListener("click", () => {
    if (!mentionSelect) return;
    const id = mentionSelect.value;
    if (!id) return;
    const player = state.players.find((p) => p.id === id);
    if (!player) return;
    insertMention(player.name);
    mentionSelect.value = "";
  });
  if (slayerTemplateBtn) {
    slayerTemplateBtn.addEventListener("click", () => {
      if (!state || !state.started) return;
      insertTextAtCursor(`${buildSlayerDeclarationTemplate()} `);
    });
  }
  if (chatFilterSelect) {
    chatFilterSelect.addEventListener("change", () => {
      if (!state) return;
      state.chatFilter = chatFilterSelect.value || "all";
      renderChat();
      saveState();
    });
  }
  var _chatSearchDebounceTimer = null;
  if (chatSearchInput) {
    chatSearchInput.addEventListener("input", () => {
      if (!state) return;
      if (_chatSearchDebounceTimer) clearTimeout(_chatSearchDebounceTimer);
      _chatSearchDebounceTimer = setTimeout(() => {
        if (!state) return;
        state.chatSearch = chatSearchInput.value || "";
        renderChat();
        saveState();
      }, 120);
    });
  }
  if (chatAutoScrollBtn) {
    chatAutoScrollBtn.addEventListener("click", () => {
      if (!state) return;
      state.chatAutoFollow = !(state.chatAutoFollow !== false);
      if (state.chatAutoFollow !== false) {
        lockChatToBottom(320);
        markChatReadToLatest();
        renderChat({ forceScroll: true });
      } else {
        syncUnreadChatCount();
        updateChatToolbarStatus();
      }
      saveState();
    });
  }
  if (chatJumpLatestBtn) {
    chatJumpLatestBtn.addEventListener("click", () => {
      if (!state) return;
      state.chatAutoFollow = true;
      lockChatToBottom(360);
      markChatReadToLatest();
      renderChat({ forceScroll: true });
      saveState();
    });
  }
  if (chatBox) {
    chatBox.addEventListener("scroll", () => {
      if (!state || !isPublicChatTabActive()) return;
      if (isChatNearBottom()) {
        markChatReadToLatest();
      } else {
        syncUnreadChatCount();
      }
      updateChatToolbarStatus();
    });
  }
  window.addEventListener("resize", () => {
    if (!state || state.chatAutoFollow === false || !isPublicChatTabActive()) return;
    scheduleChatRelock(300);
  });
  if (peekTownBtn) {
    peekTownBtn.addEventListener("click", () => {
      setDiscussionDrawer("town");
    });
  }
  if (peekLogBtn) {
    peekLogBtn.addEventListener("click", () => {
      setDiscussionDrawer("log");
    });
  }
  if (peekTownCloseBtn) {
    peekTownCloseBtn.addEventListener("click", () => {
      setDiscussionDrawer("town", false);
    });
  }
  if (peekLogCloseBtn) {
    peekLogCloseBtn.addEventListener("click", () => {
      setDiscussionDrawer("log", false);
    });
  }
  if (discussionOverlayBackdrop) {
    discussionOverlayBackdrop.addEventListener("click", () => {
      closeDiscussionDrawers();
    });
  }
  passBtn.addEventListener("click", async () => {
    if (!state || !state.started || state.phase !== "day" || state.dayStage !== "discussion") return;
    const human = state.players.find((p) => p.isHuman);
    addLogEntry("\u73A9\u5BB6\u8DF3\u8FC7\u8BA8\u8BBA", "chat", { player: human.name });
    enterNomination();
  });
  privateSendBtn.addEventListener("click", async () => {
    if (!state || !state.started || state.ended) return;
    if (!isPrivateChatOpen()) return;
    const targetId = privateTargetSelect.value;
    if (!targetId) return;
    const target = state.players.find((p) => p.id === targetId);
    if (!target) return;
    const text = privateInput.value.trim();
    if (!text) return;
    const human = state.players.find((p) => p.isHuman);
    addPrivateChat(human.name, target.name, text);
    privateInput.value = "";
    await respondToPrivate(target, text);
  });
  var toggleModelListBtn = document.getElementById("toggleModelListBtn");
  var playerModelListEl2 = document.getElementById("playerModelList");
  var modelListVisible = false;
  function renderPlayerModelList() {
    if (!playerModelListEl2 || !state || !state.players.length) return;
    playerModelListEl2.innerHTML = "";
    state.players.forEach((player) => {
      const row = document.createElement("div");
      row.className = "player-model-row";
      const nameSpan = document.createElement("span");
      nameSpan.className = player.isHuman ? "pm-name pm-human" : "pm-name";
      nameSpan.textContent = player.name + (player.isHuman ? " (\u4F60)" : "");
      row.appendChild(nameSpan);
      if (player.isHuman) {
        const hint = document.createElement("span");
        hint.style.cssText = "color:var(--muted);font-size:12px;";
        hint.textContent = "\u4EBA\u7C7B\u73A9\u5BB6";
        row.appendChild(hint);
      } else {
        const sel = document.createElement("select");
        const defaultOpt = document.createElement("option");
        defaultOpt.value = "default";
        defaultOpt.textContent = "\u9ED8\u8BA4\u6A21\u578B";
        sel.appendChild(defaultOpt);
        MODEL_OPTIONS.forEach((opt) => {
          const o = document.createElement("option");
          o.value = opt.value;
          o.textContent = opt.label;
          sel.appendChild(o);
        });
        sel.value = player.modelChoice || "default";
        sel.addEventListener("change", () => {
          player.modelChoice = sel.value;
          saveState();
        });
        row.appendChild(sel);
      }
      playerModelListEl2.appendChild(row);
    });
  }
  if (toggleModelListBtn) {
    toggleModelListBtn.addEventListener("click", () => {
      modelListVisible = !modelListVisible;
      if (playerModelListEl2) {
        playerModelListEl2.style.display = modelListVisible ? "grid" : "none";
      }
      if (modelListVisible) {
        renderPlayerModelList();
      }
      toggleModelListBtn.textContent = modelListVisible ? "\u2715 \u6536\u8D77\u6A21\u578B\u914D\u7F6E" : "\u2699 \u914D\u7F6E\u73A9\u5BB6\u6A21\u578B";
    });
  }
  document.querySelectorAll(".chat-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".chat-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".chat-tab-content").forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add("active");
      if (tab.dataset.target === "chatTabContentPublic") {
        if (state) {
          if (state.chatAutoFollow !== false) {
            lockChatToBottom(280);
            markChatReadToLatest();
          } else {
            syncUnreadChatCount();
          }
          renderChat({ forceScroll: state.chatAutoFollow !== false });
        }
      } else if (state) {
        updateChatToolbarStatus();
      }
    });
  });
  var settingsGearBtn = document.getElementById("settingsGearBtn");
  var drawerCloseBtn = document.getElementById("drawerCloseBtn");
  var drawerOverlay = document.getElementById("drawerOverlay");
  settingsGearBtn.addEventListener("click", openSettingsDrawer);
  drawerCloseBtn.addEventListener("click", closeSettingsDrawer);
  drawerOverlay.addEventListener("click", closeSettingsDrawer);
  document.querySelectorAll(".settings-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".settings-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".settings-tab-content").forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add("active");
    });
  });
  var saved2 = loadState();
  if (saved2) {
    setState(saved2);
    normalizeState();
    renderAll();
  }
  initModelSelect();
  initRoleSelect();
  restoreSettings();
  renderModelHealthCheck();
  autoLoadModelCatalog();
  populateApiKeyInputs();
  initSpeechRecognition();
  setupSeatCircleObserver();
  setupChatLayoutObserver();
  window.addEventListener("resize", () => renderSeatCircle2());
  renderConfigSummary();
  renderTokenUsageDisplay2();
  if (state && state.started && state.phase === "night") {
    scheduleAutoNight();
  }
  updateHeaderPhase();
})();
