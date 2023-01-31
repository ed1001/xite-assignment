import { useCallback, useEffect, useRef } from "react";
import partition from "lodash.partition";

/*******************************************************
 *  scrolls to either an added node or if no added nodes
 *  scroll to element that has had a active class added
 *******************************************************/

const createMutationObserver = () => {
  return new MutationObserver((mutations) => {
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
};

const useScrollToAddedOrActiveElement = () => {
  const observer = useRef<MutationObserver>(createMutationObserver());

  useEffect(() => {
    // to overcome strict mode double render, reset the observer.
    // Interestingly the call to observe carries over
    // when resetting the observer
    observer.current = createMutationObserver();

    return () => {
      observer.current.disconnect();
    };
  }, []);

  return useCallback((node: HTMLDivElement) => {
    if (node) {
      observer.current.observe(node, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    }
  }, []);
};

export default useScrollToAddedOrActiveElement;
