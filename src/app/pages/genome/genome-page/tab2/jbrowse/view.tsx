import React, { useState, useEffect } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view'
import { onStateChange } from './jbrowse.service'
// import { G4GTrack,G4CTrack,GeneTrack }  from './jbrowse.config'
// import defaultSession  from './defaultSession'
import config from './config'

type ViewModel = ReturnType<typeof createViewState>
interface ViewProps {
  assemblyName: string;
  locString: string;
}

const url: string = 'https://g4vista-api.med.niigata-u.ac.jp/jbrowse/';

const View: React.FC<ViewProps> = ({assemblyName,locString}) => {
  const [viewState, setViewState] = useState<ViewModel>()
  // const [patches, setPatches] = useState('')
  // const [stateSnapshot, setStateSnapshot] = useState('')
  const [text, setStateLocal] = useState(null)

  const assembly = {
    name: assemblyName,
    sequence: {
      type: 'ReferenceSequenceTrack',
      trackId: 'ReferenceSequenceTrack',
      adapter: {
        type: 'BgzipFastaAdapter',
        fastaLocation: {
          uri: url + assemblyName + '/' + assemblyName + '.fa.gz',
        },
        faiLocation: {
          uri: url + assemblyName + '/' + assemblyName + '.fa.gz.fai',
        },
        gziLocation: {
          uri: url + assemblyName + '/' + assemblyName + '.fa.gz.gzi',
        },
      },
    }}
    // track.assemblyNames = [assemblyName]
    // track.adapter.gffGzLocation = url + assemblyName + '/' + assemblyName + '_g.gff.gz'
    // track.adapter.index.location = track.adapter.gffGzLocation + '.tbi'



  useEffect(() => {
    const subscription = onStateChange((newState) => {
      setStateLocal(newState);
    });
    const state = createViewState({

      assembly,
      tracks:[
        {
          type: 'FeatureTrack',
          trackId: 'g4_g',
          name: 'G-Rich Sequences',
          assemblyNames: [assemblyName],
          adapter: {
            type: 'Gff3TabixAdapter',
            gffGzLocation: {uri: 'https://g4vista-api.med.niigata-u.ac.jp/jbrowse/aaa/aaa_g.gff.gz'},
            index: {
              location: {uri:'https://g4vista-api.med.niigata-u.ac.jp/jbrowse/aaa/aaa_g.gff.gz.tbi'},
              indexType: 'TBI'
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


        }
      ],
      // defaultSession,
      plugins: [],
      location: locString,

      // onChange: patch => {
      //   setPatches(previous => previous + JSON.stringify(patch) + '\n')
      // },
      configuration: {
        rpc: {
          defaultDriver: 'WebWorkerRpcDriver',
        },
        theme :{
          palette: {
            primary: {
              main: "#00cc99"
            },
            secondary: {
              main: "#00cc99"
            },
            tertiary: {
              main: "#d7e3ff"
            },
            quaternary: {
              main: "#00cc99"
            }
          }
        },
      },
      hydrateFn: hydrateRoot,
      createRootFn: createRoot,
      makeWorkerInstance: () => {
        return new Worker(new URL('./rpc-worker.worker', import.meta.url), {
          type: 'module',
        })
      },
    })
    state.session.view.showTrack('ReferenceSequenceTrack')
    // state.session.view.showTrack('g4_c')
    state.session.view.showTrack('g4_g')
    // state.session.view.showTrack('genes')

    setViewState(state)
    // 清理订阅
    return () => {
      subscription.unsubscribe();
    };
  }, [])


  if (!viewState) {
    return null
  }
  // if (locString) {
  //   console.log('location:', locString);
  //   viewState.session.view.navToLocString(locString);
  //   // viewState.session.view.addToHighlights( location as Required<ParsedLocString>);
  // }


  return (
    <React.StrictMode>
      <JBrowseLinearGenomeView viewState={viewState} />

      {/* <h3>Control the view</h3>
      <div>
        <p>
          This is an example of controlling the view from other elements on the
          page. Clicking on a button will navigate the view to the location of
          that gene.
        </p>
        <button
          onClick={() => {
            viewState.session.view.navToLocString('10:94762681..94855547')
          }}
        >
          CYP2C19
        </button>
        <button
          onClick={() => {
            viewState.session.view.navToLocString('13:32315086..32400266')
          }}
        >
          BRCA2
        </button>
      </div>
      <h3>See the state</h3>
      <div>
        <p>
          The button below will show you the current session, which includes
          things like what region the view is showing and which tracks are open.
          This session JSON object can be used in the{' '}
          <code>defaultSession</code> of <code>createViewState</code>.
        </p>
        <button
          onClick={() => {
            setStateSnapshot(JSON.stringify(viewState.session, undefined, 2))
          }}
        >
          Show session
        </button>
      </div> */}
      {/* <textarea value={stateSnapshot} readOnly rows={20} cols={80} />
      <h3>React to the view</h3>
      <p>
        Using <code>onChange</code> in <code>createViewState</code>, you can
        observe what is happening in the view and react to it. The changes in
        the state of the view are emitted as{' '}
        <a href="http://jsonpatch.com/" target="_blank" rel="noreferrer">
          JSON patches
        </a>
        . The patches for the component on this page are shown below.
      </p>
      <textarea value={patches} readOnly rows={5} cols={80} wrap="off" /> */}

      </React.StrictMode>
  )
}

export default View
