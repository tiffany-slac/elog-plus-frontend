import { useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import cn from "classnames";
import Pane from "../components/Pane";
import Spinner from "../components/Spinner";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import LogbookForm from "../components/LogbookForm";
import { useLogbookFormsStore } from "../logbookFormsStore";
import useLogbooks from "../hooks/useLogbooks";
import elogLogo from "../assets/temp_elog_logo.png";

const MIN_PANE_WIDTH = 384;

export default function Admin() {
  const { logbooks, refresh } = useLogbooks();
  const { logbookId: selectedLogbookId } = useParams();
  const selectedLogbook = logbooks?.find(({ id }) => id === selectedLogbookId);
  const logbooksEdited = useLogbookFormsStore((state) =>
    Object.keys(state.forms)
  );

  const isSmallScreen = useIsSmallScreen();
  const bodyRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const mouseMoveHandler = useCallback((e: MouseEvent) => {
    if (bodyRef.current && gutterRef.current) {
      const gutterRect = gutterRef.current.getBoundingClientRect();
      bodyRef.current.style.flexBasis =
        Math.max(e.clientX - gutterRect.width / 2, MIN_PANE_WIDTH) + "px";
    }
  }, []);

  const endDrag = useCallback(() => {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", endDrag);
  }, [mouseMoveHandler]);

  const startDrag = useCallback(() => {
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", endDrag);
  }, [mouseMoveHandler, endDrag]);

  const onSave = useCallback(() => {
    refresh();
    toast.success("Saved logbook");
  }, [refresh]);

  return (
    <div className="flex flex-col max-h-screen">
      <div className="p-2 shadow z-10">
        <div className="container m-auto">
          <Link to="/" className="text-center mb-3 w-full md:mb-0 md:w-auto">
            <img src={elogLogo} className="inline" alt="SLAC E-LOG logo" />
          </Link>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div
          ref={bodyRef}
          className={cn(
            "w-1/2 flex flex-col justify-stretch p-3 overflow-y-auto",
            // Don't want to have border when loading
            logbooks ? "divide-y" : "justify-center w-full",
            !selectedLogbook && "flex-1 pr-3"
          )}
        >
          <div className="text-xl mb-2 font-normal text-gray-500">Logbooks</div>
          {logbooks ? (
            logbooks.map((logbook) => (
              <Link
                key={logbook.id}
                to={`/admin/${logbook.id}`}
                tabIndex={0}
                className={cn(
                  "p-2 hover:bg-gray-100 cursor-pointer uppercase",
                  selectedLogbook?.id === logbook.id &&
                    "bg-blue-100 hover:!bg-blue-200"
                )}
              >
                {logbook.name}
                <span className="text-gray-500">
                  {logbooksEdited.includes(logbook.id) && "*"}
                </span>
              </Link>
            ))
          ) : (
            <Spinner className="self-center" />
          )}
        </div>
        <div
          className="relative border-r cursor-col-resize select-none"
          onMouseDown={startDrag}
          ref={gutterRef}
        >
          <div className="absolute -left-3 w-6 h-full" />
        </div>
        {selectedLogbook && (
          <div
            className={cn("pb-3", !isSmallScreen && "flex-1 flex-shrink")}
            style={{ minWidth: isSmallScreen ? "auto" : MIN_PANE_WIDTH }}
          >
            <Pane home="/admin">
              <br className="w-full" />
              {selectedLogbook && (
                <LogbookForm logbook={selectedLogbook} onSave={onSave} />
              )}
            </Pane>
          </div>
        )}
      </div>
    </div>
  );
}
