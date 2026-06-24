// frontend/src/services/licenseService.js (Full Code)

export const licenseService = {
  /**
   * Retrieves the current saved license key metadata parameters from local machine context
   */
  getSavedLicenseKey() {
    return localStorage.getItem('activation_license_token') || '';
  },

  /**
   * Evaluates if a key string conforms to structural format layout rules
   * Format expectation rules: P2T-[CATEGORY-CHAR]-[TIMESTAMP-HEX]-[SIGNATURE-TOKEN]
   */
  validateLicenseStructure(key) {
    if (!key || typeof key !== 'string') return false;
    
    const formattedKey = key.trim().toUpperCase();
    if (!formattedKey.startsWith('P2T-')) return false;

    const parts = formattedKey.split('-');
    // Expecting 4 blocks: P2T, Category Flag, Expiration Hex, Validation Signature
    return parts.length === 4;
  },

  /**
   * Decodes expiration milestones embedded inside the key matrix parameters
   */
  checkLicenseValidity() {
    const key = this.getSavedLicenseKey();
    if (!this.validateLicenseStructure(key)) {
      return { isValid: false, status: 'UNLICENSED', message: 'No valid activation key found.' };
    }

    try {
      const parts = key.trim().toUpperCase().split('-');
      const expirationHex = parts[2]; // Extracts chronological hex timestamp marker
      
      const expirationTimestamp = parseInt(expirationHex, 16);
      if (isNaN(expirationTimestamp)) {
        return { isValid: false, status: 'CORRUPTED', message: 'Invalid token encryption metrics.' };
      }

      const currentTime = Date.now();
      const relativeTimeRemaining = expirationTimestamp - currentTime;

      if (relativeTimeRemaining <= 0) {
        return { isValid: false, status: 'EXPIRED', message: 'License key has expired. Please contact support.' };
      }

      // Convert millisecond limits back into day values
      const daysRemaining = Math.ceil(relativeTimeRemaining / (1000 * 60 * 60 * 24));

      return {
        isValid: true,
        status: 'ACTIVE',
        daysRemaining: daysRemaining,
        message: `License status nominal. System verified for ${daysRemaining} remaining days.`
      };

    } catch (err) {
      return { isValid: false, status: 'ERROR', message: 'Licensing calculation execution fault.' };
    }
  },

  /**
   * Helper utility to generate keys for your private Plant2Tree Admin App allocation tools
   * Generates standard 1-year validation tokens based on clinic type selections
   */
  generateOneYearLicense(category = 'DENT') {
    const prefix = 'P2T';
    const catFlag = category.substring(0, 4).toUpperCase();
    
    // Set validation boundary exactly 365 days out into the future milestone line
    const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
    const expirationTimestamp = Date.now() + oneYearInMs;
    const expirationHex = expirationTimestamp.toString(16).toUpperCase();

    // Generate a simple validation checksum tail token based on strings parameters lengths
    const checksumSource = `${catFlag}${expirationHex}PLANT2TREE`;
    let checksum = 0;
    for (let i = 0; i < checksumSource.length; i++) {
      checksum += checksumSource.charCodeAt(i);
    }
    const signatureHex = (checksum % 256).toString(16).padStart(2, '0').toUpperCase();

    return `${prefix}-${catFlag}-${expirationHex}-${signatureHex}`;
  }
};