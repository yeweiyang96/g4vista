export const track = {
  type: 'FeatureTrack',
  trackId: 'g4_g',
  name: 'G-Rich Sequences',
  assemblyNames: [''],

  adapter: {
    type: 'Gff3TabixAdapter',
    gffGzLocation: '',
    index: {
      location: '',
    },
  },
  displays: [
    {
      id: 'g4g',
      displayId: 'g4_g-LinearBasicDisplay',
      type: 'LinearBasicDisplay',
      configuration: 'g4_g-LinearBasicDisplay',
      renderer: {
        type: 'SvgFeatureRenderer',
        color1:
          "jexl: cast({ T1_G_Rich: '#388E3C', T2_G_Rich: '#43A047', T3_G_Rich: '#4CAF50', T4_G_Rich: '#66BB6A'})[get(feature, 'type')]",
        color2: 'blue',
        color3: '#DEA3DA',
      },
    },
  ],
};
