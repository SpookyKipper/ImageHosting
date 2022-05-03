import { Listbox } from "@headlessui/react";
import classNames from "classnames";
import { FC, Fragment, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { useOnClickOutside } from "../hooks/use-on-click-outside.helper";
import { inputClasses, InputContainer } from "./input/input-container";

export interface HostListProps {
  hosts: string[];
  username: string;
  placeholder?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onChange: (values: string[]) => void;
}

// todo: this is kind of hacked together until
// https://github.com/tailwindlabs/headlessui/pull/648 is merged
export const HostList: FC<HostListProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([props.hosts[0]]);
  const reference = useRef<HTMLDivElement>(null);
  const Icon = open ? ChevronUp : ChevronDown;

  useOnClickOutside(reference, () => setOpen(false));

  const isSelected = (value: string) => selectedHosts.includes(value);
  const onChange = (value: string) => {
    if (!isSelected(value)) {
      const withValue = [...selectedHosts, value];
      setSelectedHosts(withValue);
      props.onChange(withValue);
    } else {
      const withoutValue = selectedHosts.filter((host) => host !== value);
      setSelectedHosts(withoutValue);
      props.onChange(withoutValue);
    }
  };

  return (
    <div ref={reference} className="relative z-10">
      <Listbox as={Fragment} value={selectedHosts as unknown as string} onChange={onChange}>
        <InputContainer
          className="cursor-pointer"
          onClick={() => setOpen(!open)}
          prefix={props.prefix}
          suffix={props.suffix}
        >
          <div className={classNames(inputClasses, "flex items-center justify-between select-none overflow-hidden")}>
            <span className="truncate">{selectedHosts.join(", ")}</span>
            <Icon className="text-gray-300" />
          </div>
        </InputContainer>
        {open && (
          <Listbox.Options
            className="absolute right-0 mt-2 overflow-y-auto rounded-md shadow-2xl bg-dark-300 focus:outline-none max-h-56 min-w-[10em] w-full overflow-y-auto"
            static
          >
            {props.hosts.map((host) => (
              <Listbox.Option as={Fragment} key={host} value={host}>
                {({ active }) => {
                  const highlight = active || isSelected(host);
                  const classes = classNames(
                    "text-white bg-dark-600",
                    highlight && "text-white bg-dark-600",
                    "select-none"
                  );
                  return <div className={classes}>{host.replace("{{username}}", props.username)}</div>;
                }}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        )}
      </Listbox>
    </div>
  );
};
