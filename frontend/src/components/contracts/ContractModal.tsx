import {Contract} from "../../Pages/Admin/Contracts.tsx";
import Modal from '../Modal.tsx';
import {REGEXPS} from "@redaty/lejs/dist/constants"
import {render} from "@redaty/lejs"
import {useRef} from 'react';
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

  if (!template) {
    return null;
  }

  const data = contract.data || {};

  const variableKeys = (template.content?.match(REGEXPS.variable.regexp) || [])
    .map(key=>{
      const startLength = REGEXPS.variable.start.length
      return key.substring(startLength, key.length - startLength - REGEXPS.variable.end.length + 2);
    });



  const renderedContent = render(template.content!, variableKeys.reduce((out, current) => {
    if (out[current] === undefined) {
      out[current] = current;
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

          {variableKeys.map((key: string, index: number)=>(
            <div className="flex text-right mt-2" key={'input_'+index}>
              <label htmlFor={`field-${key}`} className="w-36 text-sm text-zinc-500 text-right content-center pe-3">
                {key}:
              </label>
              <input
                id={`field-${key}`}
                type="text"
                value={data[key]}
                onChange={(e) => {
                  setContract({
                    ...contract,
                    data: {...data, [key]: e.target.value}
                  })
                }}
                className="flex-1 px-3 py-1.5 rounded-md border border-zinc-300 bg-zinc-50 text-zinc-800 placeholder-zinc-400
               focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                placeholder={key}
              />
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
