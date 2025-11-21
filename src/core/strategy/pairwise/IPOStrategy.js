const PairwiseStrategy = require("./PairwiseStrategy");
const { generatePairwise } = require("./PairwiseEngine");

class IPOStrategy extends PairwiseStrategy {
    generate(parameters) {
        return generatePairwise(parameters);
    }
}

module.exports = IPOStrategy;