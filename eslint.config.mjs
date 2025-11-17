import nextConfig from "eslint-config-next";

const stripPluginConfigs = (plugin) => {
  if (!plugin || typeof plugin !== "object") {
    return plugin;
  }
  const { configs, ...rest } = plugin;
  return rest;
};

const sanitizeConfig = (config) => {
  if (!config || typeof config !== "object" || !config.plugins) {
    return config;
  }

  const safePlugins = Object.fromEntries(
    Object.entries(config.plugins).map(([name, plugin]) => [name, stripPluginConfigs(plugin)])
  );

  return {
    ...config,
    plugins: safePlugins,
  };
};

export default nextConfig.map(sanitizeConfig);
