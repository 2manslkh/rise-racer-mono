import { Dispatch, SetStateAction, useEffect } from "react";

type PaginationButtonProps = React.HTMLAttributes<HTMLDivElement> & {
  selected?: boolean;
  children: React.ReactNode;
};

const PaginationButton = ({
  selected,
  children,
  ...props
}: PaginationButtonProps) => {
  return (
    <div
      {...props}
      className={`w-6 h-6 bg-[#5900A7] flex items-center justify-center box-border rounded-lg ${selected ? "border border-solid border-white" : ""} font-inter text-xs font-extrabold text-white`}
    >
      {children}
    </div>
  );
};

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalNumberOfData,
  pageSize,
}: {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalNumberOfData: number;
  pageSize: number;
}) => {
  const totalPages = Math.ceil(totalNumberOfData / pageSize);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const item = target.closest("[data-id]") as HTMLElement | null;
    const id = item?.getAttribute("data-id");

    if (id) {
      if (id === "PREV") {
        if (currentPage === 1) return;
        setCurrentPage(currentPage - 1);
      } else if (id === "NEXT") {
        if (currentPage === totalPages) return;
        setCurrentPage(currentPage + 1);
      } else {
        setCurrentPage(+id);
      }
    }
  };

  return (
    <div
      className="relative w-full flex items-center justify-center gap-1"
      onClick={handleClick}
    >
      <PaginationButton data-id={"PREV"}>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 5.86603C0.333333 5.48113 0.333333 4.51887 1 4.13397L7.75 0.236859C8.41667 -0.148041 9.25 0.333085 9.25 1.10289V8.89711C9.25 9.66691 8.41667 10.148 7.75 9.76314L1 5.86603Z"
            fill="white"
          />
        </svg>
      </PaginationButton>
      {totalPages <= 5 ? (
        <>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationButton
              key={page}
              selected={currentPage === page}
              data-id={page}
            >
              {page}
            </PaginationButton>
          ))}
        </>
      ) : (
        <>
          {currentPage >= totalPages - 3 ? (
            <>
              {/* Means the last page is relatively far away from the current page 
          So render first 3 pages ... then last page*/}
              <PaginationButton selected data-id={currentPage}>
                {currentPage}
              </PaginationButton>
              <PaginationButton selected data-id={currentPage + 1}>
                {currentPage + 1}
              </PaginationButton>
              <PaginationButton selected data-id={currentPage + 2}>
                {currentPage + 2}
              </PaginationButton>
              <PaginationButton>...</PaginationButton>
              <PaginationButton selected data-id={totalPages}>
                {totalPages}
              </PaginationButton>
            </>
          ) : (
            <>
              {/* Means the last page is relatively near from the current page
           So render first page ... then last 3 page */}
              <PaginationButton selected={1 === currentPage} data-id={1}>
                1
              </PaginationButton>
              <PaginationButton>...</PaginationButton>
              <PaginationButton
                selected={totalPages - 2 === currentPage}
                data-id={totalPages - 2}
              >
                {totalPages - 2}
              </PaginationButton>
              <PaginationButton
                selected={totalPages - 1 === currentPage}
                data-id={totalPages - 1}
              >
                {totalPages - 1}
              </PaginationButton>
              <PaginationButton
                selected={totalPages === currentPage}
                data-id={totalPages}
              >
                {totalPages}
              </PaginationButton>
            </>
          )}
        </>
      )}

      <PaginationButton data-id={"NEXT"}>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 5.86603C9.66667 5.48113 9.66667 4.51887 9 4.13397L2.25 0.236859C1.58333 -0.148041 0.75 0.333085 0.75 1.10289V8.89711C0.75 9.66691 1.58333 10.148 2.25 9.76314L9 5.86603Z"
            fill="white"
          />
        </svg>
      </PaginationButton>
    </div>
  );
};

export default Pagination;
