const carbonSelectors = {
  userFeild: '#user_email',
  passFeild: '#user_password',
  loginButton: '#Log_in_id',
  uploadButton: '.file-picker-button',
  selectResin: '.Select-value',
  partsListSelect: '.part-list-opener.p0.container-flex.align-cen.justify-sb',
  partsList: '.item-list',
  firstPart: 'div.item-list > div.list-part:nth-child(1)',
  secondPart: 'div.item-list > div.list-part:nth-child(2)',
  orientTab:
    'div.pannel-buttons-wrapper.h-100.overflow-hidden > a:nth-child(1)',
  minFootprintBtn: '.side-bar-subsection > div.button.fs-0.default.block',
  xAxisRotation: 'div:nth-child(1) > div.input-wrapper > input[type="number"]',
  yAxisRotation: 'div:nth-child(2) > div.input-wrapper > input[type="number"]',
  zAxisRotation: 'div:nth-child(3) > div.input-wrapper > input[type="number"]',
  layoutTab:
    'div.pannel-buttons-wrapper.h-100.overflow-hidden > a:nth-child(3)',
  autolayoutBtn: '.button.fs-0.tertiary.mb3.block',
  supportTab:
    'div.pannel-buttons-wrapper.h-100.overflow-hidden > a:nth-child(2)',
  abovePlat:
    '.side-bar-section > div:nth-child(2) > div.radio-button-group > div:nth-child(2)',
  basicSupport:
    '.side-bar-section > div:nth-child(3) > div.radio-button-group > div:nth-child(2)',
  generateBtn:
    '.side-bar-section > div:nth-child(4) > div.button.fs-0.default.block',
  suppotInfo: '.supports-info.mb0',
  analysisTab:
    'div.pannel-buttons-wrapper.h-100.overflow-hidden > a:nth-child(7)',
  startAnalysis: 'div.mt1 > div.button.fs-0.default.mt3.block',
  beforAnalysis: '.side-bar-subsection',
  machineTime: 'h1',
  materialUsage:
    'div.container-y.g1 > div.container-flex.justify-sb:nth-child(2)',
  dimentions:
    '.toolbar-segment.part-dimensions-segment.text-weight-bold.px12.justify-cen',
};

module.exports = {
  carbonSelectors,
};
