import config from '../config';

const normalizeBaseUrl = (baseUrl) => {
  if (!baseUrl) {
    return '';
  }

  return baseUrl.replace(/\/+$/, '');
};

const ensureLeadingSlash = (path) => {
  if (!path) {
    return '/';
  }

  return path.startsWith('/') ? path : `/${path}`;
};

export const buildApiUrl = (path) => {
  const normalizedBase = normalizeBaseUrl(config.API_URL);
  const normalizedPath = ensureLeadingSlash(path);

  if (!normalizedBase) {
    return normalizedPath;
  }

  return `${normalizedBase}${normalizedPath}`;
};

export const getApiBaseUrl = () => normalizeBaseUrl(config.API_URL);
