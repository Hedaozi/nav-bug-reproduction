import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import {
} from '@fluentui/react';
import {
  Nav,
  INavLink,
  INavLinkGroup,
  Stack,
} from "@fluentui/react";
import ReactMarkdown from 'react-markdown';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Doc />,
    loader: docLoader,
    children: [
      {
        path: '/',
        loader: docIndexLoader,
        element: <DocIndex />,
      },
      {
        path: '/:chapterId',
        loader: chapterLoader,
        element: <Chapter />,
      },
    ],
  },
]);

export default function App() {
  return (
    <Stack>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </Stack>
  );
};

function Doc() {
  let navigate = useNavigate();

  const docInfo = useLoaderData() as DocInfo;
  const navGroups: INavLinkGroup[] = [];
  docInfo.parts.map((part) => {
    const links: INavLink[] = [];

    part.chapters.map((chapter) => {
      links.push({
        name: chapter.name,
        url: chapter.id,
      });
    });

    navGroups.push({
      name: part.name,
      links: links,
    });
  });

  return (
    <Stack horizontal>
      <Nav
        groups={navGroups}
        onLinkClick={(ev, item) => {
          ev?.preventDefault();
          navigate(item?.url as string);
        }}
      />
      
      <Outlet />
    </Stack>
  );
}
function DocIndex() {
  return (
    <Stack>
      <ReactMarkdown>
        {useLoaderData() as string}
      </ReactMarkdown>
    </Stack>
  );
};

function Chapter() {
  return (
    <Stack>
      <ReactMarkdown>
        {useLoaderData() as string}
      </ReactMarkdown>
    </Stack>
  );
}

async function docLoader() {
  return (await import(`./sample-doc/index.json`) as DocInfo);
}

async function docIndexLoader() {
  return (await import(`./sample-doc/index.md`)).default;
}

async function chapterLoader({ params }: { params: any }) {
  return (await import(`./sample-doc/${params.chapterId}.md`)).default;
}

type DocInfo = { title: string, parts: Array<PartInfo> };

type PartInfo = { name: string, chapters: Array<ChapterInfo> };

type ChapterInfo = { name: string, id: string };
