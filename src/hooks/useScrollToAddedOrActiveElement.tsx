import { useCallback } from "react";
import partition from "lodash.partition";

/*******************************************************
 *  scrolls to either an added node or if no added nodes
 *  scroll to element that has had a active class added
 *******************************************************/

const useScrollToAddedOrActiveElement = () => {
  return useCallback((node: HTMLDivElement) => {
    if (node) {
      const observer = new MutationObserver((mutations) => {
        const [attributeMutations, nodeAddedMutations] = partition(
          mutations,
          (mutation) => mutation.type === "attributes"
        );

        let elementToScrollTo;

        if (!!nodeAddedMutations.length) {
          const [{ addedNodes }] = nodeAddedMutations;
          elementToScrollTo = addedNodes[addedNodes.length - 1] as HTMLElement;
        }

        if (!elementToScrollTo) {
          const activeElement = attributeMutations.find((mutation) =>
            [...(mutation.target as HTMLElement).classList]
              .join("")
              .includes("active")
          );
          elementToScrollTo = activeElement?.target as HTMLElement;
        }

        elementToScrollTo?.scrollIntoView({
          behavior: "smooth",
          inline: "nearest",
        });
      });

      observer.observe(node, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    }
  }, []);
};

export default useScrollToAddedOrActiveElement;
