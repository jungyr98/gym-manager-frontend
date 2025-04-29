import Contents from "./contents";

interface Props {
  params: {
    company: number;
  };
}

export default function Page({ params: company }: Props) {
  return <Contents />;
}
