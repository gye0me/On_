const getCarbonG = (tempDiff, factor) => {
    // 기온 차이에 따른 가상 전력 소모량 계산
    const energyUsed = tempDiff * 0.5; 
    // 탄소 배출량(g) 환산: 전력량 * 계수 * 1000
    return (energyUsed * factor * 1000).toFixed(2); 
};

module.exports = { getCarbonG };