const YAML = require('yaml');
const fs = require('fs');
const os = require('os');

const configFilePath = `${os.homedir()}/.wmata`;

const loadConfig = () => {
	let config = {};
	if (fs.existsSync(configFilePath)) {
		config = YAML.parse(fs.readFileSync(configFilePath, 'utf8'))
	}
	return config;
}

const writeConfig = (config) => {
	fs.writeFileSync(configFilePath, YAML.stringify(config))
}

module.exports = {loadConfig, writeConfig}
