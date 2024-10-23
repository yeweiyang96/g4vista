const url: string = 'https://g4vista-api.med.niigata-u.ac.jp/jbrowse/';

class Index {
  location: Location;
  indexType: string;
  constructor(uri: string) {
    this.location = new Location(uri);
    this.indexType = 'TBI';
  }
}

class Location {
  uri: string;
  locationType?: string;

  constructor(uri: string) {
    this.uri = uri;
    this.locationType = 'UriLocation';
  }
}

export class GeneTrack {
  type: string;
  trackId: string;
  name: string;
  adapter: Gff3TabixAdapter;
  formatDetails: { feature: string };
  assemblyNames: string[];
  constructor(name: string) {
    this.type = 'FeatureTrack';
    this.trackId = 'genes';
    this.name = 'Genes';
    this.adapter = new Gff3TabixAdapter(url + name + '/' + name + '.gff.gz');
    this.formatDetails = {
      feature:
        "jexl: {dbxref:linkout({GeneID: 'https://www.ncbi.nlm.nih.gov/gene/', ProteinID: 'https://www.ncbi.nlm.nih.gov/gene/?term='}, feature)}",
    };
    this.assemblyNames = [name];
  }
}

class Gff3TabixAdapter {
  type: string;
  gffGzLocation: Location;
  index: Index;
  constructor(uri: string) {
    this.type = 'Gff3TabixAdapter';
    this.gffGzLocation = new Location(uri);
    this.index = new Index(uri + '.tbi');
  }
}

export class G4GTrack {
  type: string;
  trackId: string;
  name: string;
  assemblyNames: string[];
  adapter: Gff3TabixAdapter;
  displays: {
    id: string;
    displayId: string;
    type: string;
    configuration: string;
    renderer: {
      type: string;
      color1: string;
      color2: string;
      color3: string;
      displayMode: string;
    };
  }[];
  constructor(name: string) {
    this.type = 'FeatureTrack';
    this.trackId = 'g4_g';
    this.name = 'G-Rich Sequences';
    this.assemblyNames = [name];
    this.adapter = new Gff3TabixAdapter(url + name + '/' + name + '_g.gff.gz');
    this.displays = [
      {
        id: 'g4g',
        displayId: 'g4_g-LinearBasicDisplay',
        type: 'LinearBasicDisplay',
        configuration: 'g4_g-LinearBasicDisplay',
        renderer: {
          displayMode: 'collapse',
          type: 'SvgFeatureRenderer',
          color1:
            "jexl: cast({ T1_G_Rich: '#388E3C', T2_G_Rich: '#43A047', T3_G_Rich: '#4CAF50', T4_G_Rich: '#66BB6A'})[get(feature, 'type')]",
          color2: 'blue',
          color3: '#DEA3DA',
        },
      },
    ];
  }
}
export class G4CTrack {
  type: string;
  trackId: string;
  name: string;
  assemblyNames: string[];
  adapter: Gff3TabixAdapter;
  displays: {
    id: string;
    displayId: string;
    type: string;
    configuration: string;
    renderer: {
      type: string;
      color1: string;
      color2: string;
      color3: string;
      displayMode: string;
    };
  }[];
  constructor(name: string) {
    this.type = 'FeatureTrack';
    this.trackId = 'g4_c';
    this.name = 'C-Rich Sequences';
    this.assemblyNames = [name];
    this.adapter = new Gff3TabixAdapter(url + name + '/' + name + '_c.gff.gz');
    this.displays = [
      {
        id: 'g4c',
        displayId: 'g4_c-LinearBasicDisplay',
        type: 'LinearBasicDisplay',
        configuration: 'g4_c-LinearBasicDisplay',
        renderer: {
          type: 'SvgFeatureRenderer',
          color1:
            "jexl: cast({ T1_C_Rich: '#FFA000', T2_C_Rich: '#FFB300', T3_C_Rich: '#FFC107', T4_C_Rich: '#FFCA28' })[get(feature, 'type')]",
          color2: 'blue',
          color3: '#DEA3DA',
          displayMode: 'collapse',
        },
      },
    ];
  }
}
