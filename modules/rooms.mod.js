/**
 * Sum of distribution must be = 100
 * @param {Object} distribution 
 * @param {number} distribution.first
 * @param {number} distribution.second
 * @param {number} distribution.third
 */
const verifyDistribution = distribution => {
    const { first, second, third } = distribution;
    return ((first + second + third) !== 100) 
        ? false
        : true
}

module.exports = {
    verifyDistribution
}