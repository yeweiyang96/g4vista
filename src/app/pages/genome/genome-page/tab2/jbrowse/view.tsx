import React, { useState, useEffect } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view'
import { onStateChange } from './jbrowse.service'
import { G4GTrack,G4CTrack,GeneTrack }  from './track'
import TestPlugin  from 'jbrowse-plugin-linkout'


type ViewModel = ReturnType<typeof createViewState>
interface ViewProps {
  assemblyName: string;
  locString: string;
}

const url: string = 'https://g4vista-api.med.niigata-u.ac.jp/jbrowse/';

const View: React.FC<ViewProps> = ({ assemblyName, locString }) => {
  const [viewState, setViewState] = useState<ViewModel>()
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
    }};

  const tracks = [new G4CTrack(assemblyName), new G4GTrack(assemblyName), new GeneTrack(assemblyName)];

  useEffect(() => {
    const state = createViewState({
      assembly,
      tracks,
      plugins: [TestPlugin],
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
      // makeWorkerInstance,
      makeWorkerInstance: () => {
        return new Worker(new URL('./rpc-worker.worker', import.meta.url), {
          type: 'module',
        })
      },
    })
    state.session.view.showTrack('ReferenceSequenceTrack')
    state.session.view.showTrack('genes')
    state.session.view.showTrack('g4_g')
    state.session.view.showTrack('g4_c')
    setViewState(state)
    const subscription = onStateChange((locString) => {
      console.log('sub:', locString, assemblyName);
      state.session.view.navToLocString(locString,assemblyName);
    });

    const style = document.createElement('style');
    style.innerHTML = `
      #jbrowse_linear_genome_view > div > div > div {
        padding: 0px; margin: -5px;
      }
    `;
    document.head.appendChild(style);

    // 清理订阅
    return () => {
      subscription.unsubscribe();
      document.head.removeChild(style);
    };
  }, [])

  if (!viewState) {
    return null
  }

  return (
    <React.StrictMode>
      <JBrowseLinearGenomeView viewState={viewState} />
    </React.StrictMode>
  )
}

export default View
