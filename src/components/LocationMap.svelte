<script lang="ts">
	import L from "leaflet";

	export let location: {
		lat: number,
		lng: number
	};

	export const updateLocation = (location: { lat: number, lng: number }) => {
		map.setView(location, 5);
		markerLayers.removeLayer(marker);
		marker = L.marker([location.lat, location.lng], { icon });
		markerLayers.addLayer(marker);
	};

	function markerIcon() {
		let html = `<div class="map-marker"><div><svg width="24" height="24" viewBox="0 0 15 15" fill="red" xmlns="http://www.w3.org/2000/svg"><path d="M10 3.5C10 4.70948 9.14112 5.71836 8 5.94999V13.5C8 13.7761 7.77614 14 7.5 14C7.22386 14 7 13.7761 7 13.5V5.94999C5.85888 5.71836 5 4.70948 5 3.5C5 2.11929 6.11929 1 7.5 1C8.88071 1 10 2.11929 10 3.5Z" fill="red" fill-rule="evenodd" clip-rule="evenodd"></path></svg></div></div>`;
		return L.divIcon({
			html,
			className: "map-marker",
		});
	}

	let map: L.Map;
	let marker: L.Marker;

	let markerLayers = L.layerGroup();
	let icon = markerIcon();

	function mapAction(container: HTMLDivElement) {
		map = createMap(container);

		marker = L.marker([location.lat, location.lng], { icon });

		markerLayers.addLayer(marker);

		markerLayers.addTo(map);

		return {
			destroy: () => {
				map.remove();
			},
		};
	}

	function createMap(container: HTMLDivElement) {
		let m = L.map(container, { preferCanvas: true }).setView(
			location,
			5
		);
		L.tileLayer(
			"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
			{
				attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
				subdomains: "abcd",
				maxZoom: 14,
			}
		).addTo(m);

		return m;
	}

	function resizeMap() {
		if (map) {
			map.invalidateSize();
		}
	}

</script>

<svelte:window on:resize={resizeMap} />

<link
	rel="stylesheet"
	href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
	integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
	crossorigin=""
/>
<div class="map z-0" style="height:100%;width:100%" use:mapAction />
