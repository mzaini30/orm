<script>
  import {
    Label,
    Select,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";

  export let data;

  let listTable = [];
  for (let n in data) {
    listTable.push({
      value: n,
      name: n,
    });
  }

  let table = [];

  let key = [];

  //   let selected = "todo";
  let selected;

  if (localStorage.stateDatabase) {
    selected = localStorage.stateDatabase;
  }

  $: if (selected) {
    // console.log(data[selected]);
    table = data[selected];
    key = Object.keys(table[0]);
    localStorage.stateDatabase = selected;
  }

  let countries = [
    { value: "us", name: "United States" },
    { value: "ca", name: "Canada" },
    { value: "fr", name: "France" },
  ];
</script>

<svelte:head>
  <title>Database</title>
</svelte:head>

<div class="p-5">
  <Label>
    Pilih table
    <Select class="mt-2 w-min" items={listTable} bind:value={selected} />
  </Label>
  <div class="overflow-x-auto">
    <Table striped={true} divClass="mt-5">
      <TableHead>
        {#each key as item}
          <TableHeadCell class="normal-case">{item}</TableHeadCell>
        {/each}
      </TableHead>
      <TableBody>
        {#each table as item}
          <TableBodyRow>
            {#each key as keyItem}
              <TableBodyCell class="font-normal">{item[keyItem]}</TableBodyCell>
            {/each}
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </div>
</div>
