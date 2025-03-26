import {Contract} from "../../Pages/Admin/Contracts.tsx";
import Modal from '../Modal.tsx';
import {REGEXPS} from "@redaty/lejs/dist/constants"
import {render} from "@redaty/lejs"
import {useEffect, useRef, useState} from 'react';
import SignaturePad from "react-signature-pad-wrapper";
import "./ContractModal.css";
import {FiSave, FiX} from "react-icons/fi";

export interface ContractModalProps {
  onClose?: () => void;
  onSave?: (contract: Contract) => void;
  contract: Contract;
  setContract: (contract: Contract) => void;
}

interface SignatureType {
  name: string;
  value?: string;
}

const ContractModal = (
  {
    onClose,
    onSave,
    contract,
    setContract,
  }: ContractModalProps
) => {
  const template = contract?.template;
  const targetRef = useRef(null);
  const signaturePadRef = useRef<SignaturePad>(null);
  const [signature, setSignature] = useState<SignatureType | null>(null);

  useEffect(() => {
    if (signaturePadRef.current) {
      const signaturePad = signaturePadRef.current;
      const canvas = signaturePad.canvas.current!;
      const ratio = window.devicePixelRatio || 1;

      if (canvas) {
        canvas.width = 600 * ratio;
        canvas.height = 300 * ratio;
        canvas.style.width = '600px';
        canvas.style.height = '300px';

        const ctx = canvas.getContext("2d");
        ctx?.scale(ratio, ratio);
      }

      signaturePad.clear();
      signaturePad.isEmpty();

      signaturePad.minWidth = 1;
      signaturePad.maxWidth = 2;
      signaturePad.penColor = 'rgb(69,69,69)';
      signaturePad.dotSize = 1;
    }
  }, [signature]);

  if (!template) {
    return null;
  }

  const data = contract.data || {};

  const variableKeys = template.fields || (template.content?.match(REGEXPS.variable.regexp) || [])
    .map((key, index)=>{
      const startLength = REGEXPS.variable.start.length
      return {
        id: index,
        name: key.substring(startLength, key.length - startLength - REGEXPS.variable.end.length + 2),
        validation: null
      };
    });

  const renderedContent = render(template.content!, variableKeys.reduce((out, current) => {
    if (out[current.name] === undefined) {
      out[current.name] = current.name;
    } else if (current.type === 'Signature' && out[current.name].startsWith('data:image')) {
      out[current.name] = '<img src="' + out[current.name] + '"  alt="Signature" style="width: 150px; display: inline-block; "/>';
    }
    return out;
  }, {...data}), undefined);

  const close = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const saveSignature = () => {
    const signaturePad = signaturePadRef.current;

    const value = signaturePad?.toDataURL("image/png");
    if (value && signature) {
      setContract({
        ...contract,
        data: {...data, [signature.name]: value}
      })
    }
    setSignature(null)
  }

  return (
    <Modal title={'Contract Modal'} onClose={close}>
      <form
        onClick={()=> {
          if (signature) {
            setSignature(null);
          }
        }}
        className="flex flex-row max-h-screen min-h-[80vh] min-w-[90vw]">
        <div className="flex-col w-full p-2 no-print">

          {variableKeys.map((templateField, index: number)=> (
            <div className="flex text-right mt-2" key={'input_'+index}>
              <label htmlFor={`field-${templateField.name}`} className="w-36 text-sm text-zinc-500 text-right content-center pe-3">
                {templateField.name}:
              </label>
              {templateField.type === 'Signature' ?
                <button
                  type="button"
                  onClick={() => {
                    setSignature({name: templateField.name});
                    return false
                  }}
                  className="border border-zinc-400 cursor-pointer h-20 w-40 bg-zinc-50 flex items-center"
                >
                  {data[templateField.name] &&
                    <img src={data[templateField.name]} className="w-full h-full bg-white" alt="Signature"/>}
                  {!data[templateField.name] && <div className="w-full align-center">Sign here</div>}
                </button>:
              <input
                id={`field-${templateField.name}`}
                type="text"
                value={data[templateField.name] || ''}
                onChange={(e) => {
                  setContract({
                    ...contract,
                    data: {...data, [templateField.name]: e.target.value}
                  })
                }}
                className="flex-1 px-3 py-1.5 rounded-md border border-zinc-300 bg-zinc-50 text-zinc-800 placeholder-zinc-400
               focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                placeholder={templateField.name}
              />
              }
            </div>
          ))}
          <div className="flex-row w-full">
            <button
              type='button'
              onClick={() => {
                if (onSave) {
                  onSave(contract);
                }
              }}
              className='px-4 py-2 mt-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition self-end'
            >
              Save
            </button>
          </div>
        </div>
        <div className="flex-col w-full">
          <div className="bg-white text-black a4-print printable"
               ref={targetRef}
               dangerouslySetInnerHTML={{__html: renderedContent}} />
        </div>
      </form>
      {signature && <div className="fixed flex flex-row left-0 top-0 p-20 w-full h-full justify-center backdrop-blur-sm">
        <div>
          <div className='flex items-center justify-between border-zinc-400 p-2 border-t border-x bg-zinc-50 rounded-t-sm'>
            <h2 className='text-lg font-semibold text-zinc-800'>Signature</h2>
            <button
              className='text-zinc-400 hover:text-zinc-600 transition cursor-pointer'
              onClick={onClose}
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="border border-zinc-400 bg-white w-[600px] h-[300px]">
            <SignaturePad ref={signaturePadRef}
                          redrawOnResize
                          canvasProps={{width: '600px', height: '300px', backgroundColor: 'white'}}
                          options={{minWidth: 5, maxWidth: 10, penColor: 'rgb(66, 133, 244)'}} />
          </div>
          <div className='flex items-center justify-between border-zinc-400 p-2 border-b border-x bg-zinc-50 rounded-b-sm'>
            <button
              onClick={saveSignature}
              className='flex items-center bg-zinc-800 text-white px-2 py-1 rounded-xs hover:bg-zinc-700'
            >
              <FiSave className='mr-1' /> Save
            </button>
            <button
              className='flex items-center px-2 py-1 rounded-xs bg-white text-zinc-800 border-zinc-700 border hover:bg-zinc-50 transition cursor-pointer'
              onClick={()=>setSignature(null)}
            >
              <FiX className='mr-1' /> Cancel
            </button>
          </div>
        </div>


      </div> }
    </Modal>
  )
};


export default ContractModal;
