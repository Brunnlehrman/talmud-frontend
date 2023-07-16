import { useEffect, useRef } from 'react';

const useKeypress = (keyCode: string, cb: any) => {

  const ref = useRef(cb)
  ref.current = cb

  useEffect(() => {
    let keypressHandler;
    keypressHandler = (event: KeyboardEvent) => {
      if (event.key === keyCode) {
        ref.current(event);
      }
    };
    window.addEventListener('keydown', keypressHandler);
    return () => {
      window.removeEventListener('keydown', keypressHandler);
    };
  }, [keyCode]);
};
export default useKeypress;
