import { useRouter } from "next/router";
import { Pagination } from "react-bootstrap";

/**
 * @param {Object} props 
 * @param {number} props.totalCount
 * @param {number} props.pageSize
 * @returns {JSX.Element}
 */
export default function PaginatedNavigation({ totalCount, pageSize, ...props }) {
  const router = useRouter();
  const { page } = router.query;
  const pageNum = page ? Number(page) : 1;
  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 1;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (<div className="d-block mx-auto" style={{width: "fit-content"}} {...props}>
    <Pagination>
      <Pagination.Prev 
        onClick={() => { 
          router.push({ pathname: router.pathname, query: { ...router.query, page: pageNum - 1 } }) 
        }} 
        disabled={pageNum === 1} 
      />  
      {pages.map((thisPage, i) => {
        if (pages.length > 7) {
          if (thisPage < pageNum - 1 && thisPage > 1) {
            if (pageNum > 4) {
              if (thisPage === 2) {
                return (<Pagination.Ellipsis key={i} />);
              } else if (!(pageNum > pages.length - 4 && thisPage > pages.length - 5)) {
                return null;
              }
            } 
          } else if (thisPage > pageNum + 1 && thisPage < pages.length) {
            if (pageNum < pages.length - 3) {
              if (thisPage === pages.length - 1) {
                return (<Pagination.Ellipsis key={i} />);
              } else if (!(pageNum < 5 && thisPage < 6)) {
                return null;
              }
            } 
          }
        }
        return (
          <Pagination.Item 
            key={i} 
            active={thisPage === pageNum} 
            onClick={() => { 
              router.push({ pathname: router.pathname, query: { ...router.query, page: thisPage } }) 
            }}
          >
            {thisPage}
          </Pagination.Item>
        );
      })}
      <Pagination.Next 
        onClick={() => { 
          router.push({ pathname: router.pathname, query: { ...router.query, page: pageNum + 1 } }) 
        }} 
        disabled={pageNum === totalPages}
      />
    </Pagination>
  </div>);
}