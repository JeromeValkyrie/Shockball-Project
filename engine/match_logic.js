/** 
 * SHOCKBALL MATCH ENGINE - CORE LOGIC
 */

// 1. THE DRAIN: Updates the player's energy levels
function calculateStaminaDrain(player) {
    let baseDrain = 1.5;
    const multipliers = { "Center": 1.2, "Wing": 1.3, "Guard": 0.8 };
    let multiplier = multipliers[player.position] || 1.0;
    let speedEffort = player.stats.speed > 90 ? 0.2 : 0.0;

    let newStamina = player.stamina - ((baseDrain * multiplier) + speedEffort);
    return Math.max(0, newStamina).toFixed(2);
}

// 2. THE PENALTY: Determines how well they can actually play right now
function getEffectiveStats(player) {
    let staminaPct = player.stamina;
    let penalty = 1.0; 

    if (staminaPct < 50 && staminaPct >= 25) {
        penalty = 0.85; // 15% drop
    } else if (staminaPct < 25) {
        penalty = 0.60; // 40% drop
    }

    return {
        name: player.name,
        reactions: Math.round(player.stats.reactions * penalty),
        speed: Math.round(player.stats.speed * penalty),
        power: Math.round(player.stats.power * penalty),
        pass_acc: Math.round(player.stats.pass_acc * penalty),
        shot_acc: Math.round(player.stats.shot_acc * penalty),
        isExhausted: staminaPct < 25
    };
}
