/**
 * Calculates stamina drain based on player position and current stats.
 * Center and Wings lose more than the Guard.
 */

function calculateStaminaDrain(player) {
    let baseDrain = 1.5; // Standard drain per game segment

    // Positional Multipliers
    const multipliers = {
        "Center": 1.2, // High movement and physical play
        "Wing": 1.3,   // Maximum sprinting/speed usage
        "Guard": 0.8   // Less distance covered, more stationary
    };

    // Apply the multiplier based on the player's position
    let multiplier = multipliers[player.position] || 1.0;
    
    // Logic: Faster players (high Speed) tend to burn energy quicker 
    // when they push their limits.
    let speedEffort = player.stats.speed > 90 ? 0.2 : 0.0;

    let totalDrain = (baseDrain * multiplier) + speedEffort;

    // Return the new stamina, ensuring it doesn't go below 0
    let currentStamina = player.stamina - totalDrain;
    return Math.max(0, currentStamina).toFixed(2);
}

// Example usage:
// let newStamina = calculateStaminaDrain(jeromeValkyrie);
