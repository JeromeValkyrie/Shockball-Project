/**
 * SHOCKBALL MANAGER: CORE MATCH ENGINE
 * Includes: Stamina Drain, Fatigue Penalties, and Action Resolution
 */

// --- SECTION 1: THE DRAIN (Updates Stamina) ---
// This runs constantly in the background during the match.
function calculateStaminaDrain(player) {
    let baseDrain = 1.5; 
    
    // Positional Multipliers: Centers and Wings run the most.
    const multipliers = {
        "Center": 1.2,
        "Wing": 1.3,
        "Guard": 0.8
    };

    let multiplier = multipliers[player.position] || 1.0;
    
    // Speed Effort: "Speed Demons" burn fuel faster.
    let speedEffort = player.stats.speed > 90 ? 0.2 : 0.0;

    let totalDrain = (baseDrain * multiplier) + speedEffort;
    
    // Calculate new stamina and ensure it never drops below 0
    let updatedStamina = player.stamina - totalDrain;
    return Math.max(0, updatedStamina).toFixed(2);
}


// --- SECTION 2: THE PENALTY (Calculates Performance) ---
// This runs whenever a player tries to perform an action.
function getEffectiveStats(player) {
    let staminaPct = player.stamina;
    let penalty = 1.0; // 100% efficiency at full stamina

    // Fatigue Thresholds
    if (staminaPct < 50 && staminaPct >= 25) {
        penalty = 0.85; // 15% reduction
    } else if (staminaPct < 25) {
        penalty = 0.60; // 40% reduction - "Exhausted"
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


// --- SECTION 3: THE ACTION (Resolves Gameplay) ---
// This decides if a shot becomes a Goal.
function resolveShot(striker, guard) {
    // 1. Get the "Tired" stats for both players
    const activeStriker = getEffectiveStats(striker);
    const activeGuard = getEffectiveStats(guard);

    // 2. Add a small "Luck Factor" (Randomness)
    // This represents the unpredictability of a moving ball.
    const luck = Math.random() * 10; 

    const totalShotPower = activeStriker.shot_acc + luck;
    const totalGuardDef = activeGuard.reactions;

    // 3. Compare Results
    if (totalShotPower > totalGuardDef) {
        return {
            scored: true,
            message: `${activeStriker.name} fires a sniper shot past ${activeGuard.name}! GOAL!`
        };
    } else {
        return {
            scored: false,
            message: `${activeGuard.name} makes an incredible save against ${activeStriker.name}!`
        };
    }
}
