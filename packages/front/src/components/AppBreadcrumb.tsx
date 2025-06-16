import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import React from "react";

interface Way {
  label: string;
  link?: string;
}

interface AppBreadcrumbProps {
  waysList: Way[];
}

export const AppBreadcrumb = ({ waysList }: AppBreadcrumbProps) => {
  waysList = waysList?.map((way) => ({
    ...way,
    label: way?.label?.[0]?.toUpperCase() + way?.label?.slice(1),
  }));

  if (waysList.length < 1) {
    return <></>;
  }

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {waysList?.map((way, i) => (
          <React.Fragment key={`${way.label}-${i}`}>
            {i > 0 && <BreadcrumbSeparator />}

            <BreadcrumbItem>
              {way?.link ? (
                <BreadcrumbLink asChild>
                  <Link href={way?.link}>{way.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{way.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
