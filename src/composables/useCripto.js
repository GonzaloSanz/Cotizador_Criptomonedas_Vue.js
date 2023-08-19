import { ref, onMounted, computed } from "vue";
import axios from "axios";

export default function useCripto() {
  const monedas = ref([
    { codigo: "EUR", texto: "Euro" },
    { codigo: "USD", texto: "Dólar de Estados Unidos" },
    { codigo: "MXN", texto: "Peso Mexicano" },
    { codigo: "GBP", texto: "Libra Esterlina" },
  ]);

  const criptomonedas = ref([]);
  const cotizacion = ref({});
  const cargando = ref(false);

  onMounted(async () => {
    // Obtener información de las criptomonedas de la API CryptoCompare
    const { data } = await axios(
      "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD"
    );

    criptomonedas.value = data.Data;
  });

  const obtenerCotizacion = async (cotizar) => {
    cargando.value = true;
    cotizacion.value = {};

    try {
      const { moneda, criptomoneda } = cotizar;

      const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
      const { data } = await axios(url);

      cotizacion.value = data.DISPLAY[criptomoneda][moneda];
    } catch (error) {
      console.log(error);
    } finally {
      cargando.value = false;
    }
  };

  const mostrarResultado = computed(() => {
    return Object.values(cotizacion.value).length > 0;
  });

  return {
    monedas,
    criptomonedas,
    cotizacion,
    cargando,
    obtenerCotizacion,
    mostrarResultado
  };
}
