const session = {
  name: 'this session',
  margin: 0,
  view: {
    id: 'linearGenomeView',
    minimized: false,
    type: 'LinearGenomeView',
    // offsetPx: 191980240,
    // bpPerPx: 0.1554251851851852,
    hideHeader: false,
    hideHeaderOverview: false,
    hideNoTracksActive: false,
    trackSelectorType: 'hierarchical',
    trackLabels: 'overlapping',
    showCenterLine: false,
    showCytobandsSetting: true,
    showGridlines: true,

    tracks: [
      {
        id: '4aZAiE-A3',
        type: 'ReferenceSequenceTrack',
        configuration: 'ReferenceSequenceTrack',
        minimized: false,
        displays: [
          {
            id: 'AD3gqvG0_6',
            type: 'LinearReferenceSequenceDisplay',
            height: 180,
            configuration:
              'ReferenceSequenceTrack-LinearReferenceSequenceDisplay',
            showForward: true,
            showReverse: true,
            showTranslation: true,
          },
        ],
      },
      {
        id: 'g4_g',
        type: 'FeatureTrack',
        configuration: 'g4_g',
        displays: [
          {
            id: 'imlg',
            height: 100,
            displayId: 'g4_g-LinearBasicDisplay',
            type: 'LinearBasicDisplay',
            configuration: 'g4_g-LinearBasicDisplay',
          },
        ],
      },
      {
        id: 'g4_c',
        type: 'FeatureTrack',
        configuration: 'g4_c',
        displays: [
          {
            id: 'imlosc',
            height: 100,
            displayId: 'g4_c-LinearBasicDisplay',
            type: 'LinearBasicDisplay',
            configuration: 'g4_c-LinearBasicDisplay',
          },
        ],
      },
      {
        id: 'genes',
        type: 'FeatureTrack',
        configuration: 'genes',
        displays: [
          {
            id: 'genes',
            height: 100,
            displayId: 'genes-LinearBasicDisplay',
            type: 'LinearBasicDisplay',
            configuration: 'genes-LinearBasicDisplay',
          },
        ],
      },
    ],
  },
};

export default session;
