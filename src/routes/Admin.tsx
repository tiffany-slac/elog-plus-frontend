import { useCallback } from "react";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { twJoin, twMerge } from "tailwind-merge";
import Spinner from "../components/Spinner";
import LogbookForm from "../components/LogbookForm";
import { useLogbookFormsStore } from "../logbookFormsStore";
import useLogbooks from "../hooks/useLogbooks";
import elogLogo from "../assets/temp_elog_logo.png";
import SideSheet from "../components/SideSheet";

export default function Admin() {
  const { logbookMap, logbooks, isLoading: isLogbooksLoading } = useLogbooks();
  const { logbookId: selectedLogbookId } = useParams();

  const selectedLogbook = selectedLogbookId
    ? logbookMap[selectedLogbookId]
    : undefined;

  const logbooksEdited = useLogbookFormsStore((state) =>
    Object.keys(state.forms)
  );

  const onSave = useCallback(() => {
    toast.success("Saved logbook");
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-2 shadow z-10">
        <div className="container m-auto">
          <Link to="/" className="text-center mb-3 w-full md:mb-0 md:w-auto">
            <img src={elogLogo} className="inline" alt="SLAC E-LOG logo" />
          </Link>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <SideSheet
          home="/admin"
          sheetBody={
            selectedLogbook && (
              <LogbookForm logbook={selectedLogbook} onSave={onSave} />
            )
          }
        >
          <div
            className={twMerge(
              "min-w-[384px] flex-1 flex flex-col justify-stretch p-3 overflow-y-auto",
              // Don't want to have border when loading
              logbooks ? "divide-y" : "justify-center w-full"
            )}
          >
            <div className="text-xl mb-2 font-normal text-gray-500">
              Logbooks
            </div>
            {isLogbooksLoading ? (
              <Spinner className="self-center" />
            ) : (
              logbooks.map((logbook) => (
                <Link
                  key={logbook.id}
                  to={`/admin/${logbook.id}`}
                  tabIndex={0}
                  className={twJoin(
                    "p-2 cursor-pointer uppercase focus:outline focus:z-0 outline-2 outline-blue-500",
                    selectedLogbook?.id !== logbook.id
                      ? "hover:bg-gray-100"
                      : "bg-blue-100 hover:bg-blue-200"
                  )}
                >
                  {logbook.name}
                  <span className="text-gray-500">
                    {logbooksEdited.includes(logbook.id) && "*"}
                  </span>
                </Link>
              ))
            )}
          </div>
        </SideSheet>
      </div>
    </div>
  );
}
