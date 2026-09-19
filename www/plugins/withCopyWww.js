const fs = require('fs');
const path = require('path');

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const s = path.join(src, item);
    const d = path.join(dst, item);
    if (fs.statSync(s).isDirectory()) { copyDir(s, d); } else { fs.copyFileSync(s, d); }
  }
}

module.exports = function withCopyWww(config) {
  let withDangerousMod;
  try {
    withDangerousMod = require('@expo/config-plugins').withDangerousMod;
  } catch (_) {
    // @expo/config-plugins not installed locally — EAS cloud will install it
    return config;
  }
  return withDangerousMod(config, ['android', (cfg) => {
    const src = path.join(cfg.modRequest.projectRoot, 'www');
    const dst = path.join(cfg.modRequest.platformProjectRoot, 'app/src/main/assets/www');
    if (fs.existsSync(src)) {
      copyDir(src, dst);
      console.log('[withCopyWww] OK:', dst);
    } else {
      console.warn('[withCopyWww] AVISO: www/ não encontrada');
    }
    return cfg;
  }]);
};
