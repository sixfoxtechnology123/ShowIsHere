export const ORG_SESSION_KEY = 'eventOrgAccount';
export const LOGIN_MOBILE_KEY = 'eventOrgLoginMobile';
export const SELECTED_LOCATION_KEY = 'selectedLocation';

export const getStoredOrg = () => {
  try {
    return JSON.parse(localStorage.getItem(ORG_SESSION_KEY) || '{}');
  } catch (error) {
    return {};
  }
};

export const saveOrgSession = (data = {}, token) => {
  const current = getStoredOrg();
  const merged = { ...current, ...data };
  localStorage.setItem(ORG_SESSION_KEY, JSON.stringify(merged));
  if (merged.loginMobile || merged.contactMobile) {
    localStorage.setItem(LOGIN_MOBILE_KEY, merged.loginMobile || merged.contactMobile);
  }
  if (token) localStorage.setItem('token', token);
  return merged;
};

export const getOrgIdentifiers = () => {
  const org = getStoredOrg();
  return {
    orgId: org.orgId || '',
    tenantKey: org.tenantKey || '',
    contactEmail: org.contactEmail || '',
    loginMobile: org.loginMobile || org.contactMobile || localStorage.getItem(LOGIN_MOBILE_KEY) || ''
  };
};

export const normalizeUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};
