module.exports = {
    // Core libraries
    I13nMixin: require('./dist/mixins/I13nMixin'),
    I13nNode: require('./dist/libs/I13nNode'),
    ReactI13n: require('./dist/libs/ReactI13n'),

    // Utils
    createI13nNode: require('./dist/utils/createI13nNode'),
    setupI13n: require('./dist/utils/setupI13n'),
    
    // I13n Components 
    I13nComponent: require('./dist/components/I13nComponent'),
    I13nAnchor: require('./dist/components/I13nAnchor'),
    I13nButton: require('./dist/components/I13nButton'),
    I13nDiv: require('./dist/components/I13nDiv')
};
