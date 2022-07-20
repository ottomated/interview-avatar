<script lang="ts">
	import { browser } from '$app/env';

	import { onDestroy } from 'svelte';
	import Logo from './Logo.svelte';

	let canvas: HTMLCanvasElement;
	let raf: number;
	let audio: AudioContext;
	let volume = 0;
	let started = false;
	const start = async () => {
		started = true;
		const ctx = canvas.getContext('2d');
		audio = new AudioContext();
		const analyzer = audio.createAnalyser();
		analyzer.fftSize = 128;
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const source = audio.createMediaStreamSource(stream);
		source.connect(analyzer);
		const data = new Uint8Array(analyzer.frequencyBinCount);

		ctx.fillStyle = 'white';
		const tick = () => {
			analyzer.getByteFrequencyData(data);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const space = canvas.width / data.length;
			let total = 0;
			for (let i = 0; i < data.length; i++) {
				total += data[i];
				const x = i * space;
				const y = data[i] / 2;
				// Draw centered rectangle
				// ^ this was me trying to trick copilot into writing my code and it didn't work
				ctx.fillRect(x - 1, canvas.height / 2 - y / 2, space + 2, y);
			}
			volume = total / data.length / 100;

			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
	};
	onDestroy(() => {
		if (browser) {
			cancelAnimationFrame(raf);
			audio?.close();
		}
	});
</script>

{#if !started}
	<div
		class="absolute top-1/2 bg-black/75 p-2 text-2xl font-bold pointer-events-none rounded-lg"
	>
		Click to start
	</div>
{/if}
<svelte:window on:click={start} />
<Logo scale={0.1 * volume + 1} />

<canvas bind:this={canvas} width={500} height={200} />
