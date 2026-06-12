<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();


	
	interface Props {
		label: string;
		name: string;
		value: string;
		checked?: boolean | undefined;
		disabled?: boolean;
		hidden?: boolean;
		size?: string;
		grid?: boolean;
	}

	let {
		label,
		name,
		value,
		checked = $bindable(undefined),
		disabled = false,
		hidden = false,
		size = '1rem',
		grid = false
	}: Props = $props();
</script>


<input {name} id={value} {value} type='checkbox' bind:checked={checked} onchange={bubble('change')} {disabled} />
<label for={value} class:grid class:hidden style:font-size={size} class:disabled>{label}</label>


<style>
  input { display: none; }

  label {
		margin: 5px;
		padding: 0.6em;
		padding-left: 1.6em;
		padding-right: 1.6em;
		text-align: center;
		
		user-select: none;
		background-color: black;
		border-radius: 10em;
		position: relative;

		text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
		box-shadow: 0px 0px 0px 3px rgba(0, 0, 0, 0);
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		cursor: pointer;

		transition:
			background-color 0.1s ease-in,
			box-shadow 0.1s ease-in;
	}

	label.disabled {
		color: gray;
		cursor: unset;
	}

	.grid { grid-column: span 3; }
  .hidden { display: none; }

	label::before {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    z-index: -1;
    margin: -2px;
    border-radius: inherit;
    background: linear-gradient(155deg, #AB8DF8, #FF00D0);
  }

	label.disabled::before {
		background: unset;
		background-color: gray;
	}

	label:not(.disabled):hover { background-color: unset; }

  input:checked + label:not(.disabled) {
		background-color: unset;
		box-shadow:
			5px 5px rgba(0, 0, 0, 0.2),
			inset 1px 0.5px 2px white,
			inset -1px -1px 3px black;
	}
</style>