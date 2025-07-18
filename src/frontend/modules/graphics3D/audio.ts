/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   audio.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/17 18:09:31 by alexy             #+#    #+#             */
/*   Updated: 2025/07/17 18:37:50 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

let audioEngine :   any;
let hitSound    :   any;
let bounceSound :   any;
let soundsReady = false;

/**
 * Initialize the audio engine and load sounds.
 */
export async function initAudio(): Promise<void> {
  try {
    console.log("Initializing audio...");
    audioEngine = await BABYLON.CreateAudioEngineAsync();

    hitSound    = await BABYLON.CreateSoundAsync("hitSound",    "/assets/sounds/hit.mp3");
    bounceSound = await BABYLON.CreateSoundAsync("bounceSound", "/assets/sounds/bounce.mp3");

    await audioEngine.unlockAsync();

    soundsReady = true;
    console.log("Audio initialized successfully");
  } catch (error) {
    console.error("Error initializing audio:", error);
  };
};

/**
 * Play the hit sound.
 */
export function playHitSound(): void {
  if (soundsReady && hitSound) {
    hitSound.play();
    console.log("Hit sound played");
  } else {
    console.warn("Hit sound not ready");
  };
};

/**
 * Play the bounce sound.
 */
export function playBounceSound(): void {
  if (soundsReady && bounceSound) {
    bounceSound.play();
    console.log("Bounce sound played");
  } else {
    console.warn("Bounce sound not ready");
  };
};