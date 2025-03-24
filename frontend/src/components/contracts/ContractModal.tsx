import {Contract} from "../../Pages/Admin/Contracts.tsx";
import Modal from '../Modal.tsx';
import {REGEXPS} from "@redaty/lejs/dist/constants"
import {render} from "@redaty/lejs"
import {useEffect, useRef} from 'react';
import SignaturePad from "react-signature-pad-wrapper";
import "./ContractModal.css";

export interface ContractModalProps {
  onClose?: () => void;
  onSave?: (contract: Contract) => void;
  contract: Contract;
  setContract: (contract: Contract) => void;
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

  useEffect(() => {
    if (signaturePadRef.current) {
      const signaturePad = signaturePadRef.current;
      signaturePad.clear();
      signaturePad.isEmpty();

      signaturePad.minWidth = 1;
      signaturePad.maxWidth = 2;
      signaturePad.penColor = 'rgb(69,69,69)';
      signaturePad.dotSize = 1;
    }
  }, []);

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
    }
    return out;
  }, {...data}), undefined);

  const close = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <Modal title={'Contract Modal'} onClose={close}>
      <form className="flex flex-row max-h-screen min-h-[80vh] min-w-[90vw]">
        <div className="flex-col w-full p-2 no-print">

          {variableKeys.map((templateField, index: number)=> (
            <div className="flex text-right mt-2" key={'input_'+index}>
              <label htmlFor={`field-${templateField.name}`} className="w-36 text-sm text-zinc-500 text-right content-center pe-3">
                {templateField.name}:
              </label>
              {templateField.type === 'Signature' ?
                <div className="border border-zinc-400">
                  <SignaturePad ref={signaturePadRef}
                                redrawOnResize
                                options={{minWidth: 5, maxWidth: 10, penColor: 'rgb(66, 133, 244)'}} />
                </div>:
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

    </Modal>
  )
};


export default ContractModal;
