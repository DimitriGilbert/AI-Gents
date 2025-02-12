import { Table } from '~/components/ui/table';
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
  MenubarItem,
} from '~/components/ui/menubar';
import {
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '~/components/ui/table';

// Define a type for the command parameters
type CommandParameter = {
  name: string;
  required: boolean;
  type: string;
  description: string;
};

// Define a type for the command object
type CommandType = {
  name: string;
  description: string;
  usage: string;
  parameters: CommandParameter[];
};

// Define a type for the commands object
type CommandsType = {
  [key: string]: CommandType;
};

const commands: CommandsType = {
  'ai-ask': {
    name: 'ai ask',
    description: 'Ask something to an AI',
    usage: 'ai ask <prompt> ...',
    parameters: [
      {
        name: 'prompt',
        required: true,
        type: 'string',
        description: 'Content to ask'
      },
      {
        name: '--api',
        required: false,
        type: 'string',
        description: 'API endpoint'
        // ... add others
      }
    ]
  },
  'ai-chat': {
    name: 'ai chat',
    description: 'Interactive chat with AI',
    usage: 'ai chat <prompt> ...',
    parameters: [/*...*/]
  }
  // Add other commands
};

// Define the props for the Command component
type CommandProps = {
  command: CommandType;
};

function Command({ command }: CommandProps) {
  const id = command.name.replace(/ /g, '-');
  return (
    <section id={id} className="mb-8">
      <h2 className="text-3xl font-bold mb-2">{command.name}</h2>
      <pre className="bg-gray-800 text-white p-4 rounded mb-4">{command.usage}</pre>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Param</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Required</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {command.parameters.map((param) => (
            <TableRow key={param.name}>
              <TableCell>{param.name}</TableCell>
              <TableCell>{param.type}</TableCell>
              <TableCell>{param.description}</TableCell>
              <TableCell>{param.required ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export default function DocumentationPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      {/* <DocsMenuBar /> */}
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-6">
        {Object.values(commands).map((cmd) => (
          <Command key={cmd.name} command={cmd} />
        ))}
      </div>
    </main>
  );
}