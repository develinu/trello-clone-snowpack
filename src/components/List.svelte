<script>
  import CreateCard from '~/components/CreateCard.svelte'
  import ListTitle from '~/components/ListTitle.svelte'
  import Card from '~/components/Card.svelte'
  import { onMount } from 'svelte'
  import Sortable from 'sortablejs'
  import { cards } from '~/store/list'

  export let list
  export let sortableLists

  let sortableCards
  let cardsEl

  function disableSortable(event) {
    console.log(event.detail)
    sortableLists.option('disabled', event.detail)
    sortableCards.option('disabled', event.detail)
  }

  onMount(() => {
    sortableCards = new Sortable(cardsEl, {
      group: "My Cards",
      handle: ".card",
      delay: 50,
      animation: 0,
      forceFallback: true, 
      // true : sortablejs 자체 DnD 동작
      // false : html5 기본 DnD 동작 -> 크로스 브라우징 이슈 발생

      onEnd(event) {
        console.log(event)
        cards.reorder({
          fromListId: event.from.dataset.listId,
          toListId: event.to.dataset.listId,
          oldIndex: event.oldIndex,
          newIndex: event.newIndex
        })
      }
    })
  })
</script>

<div class="list">
  <div class="list__inner">
    <div class="list__haeding">
      <ListTitle 
        {list} 
        on:editMode={disableSortable} />
      <p>
        {list.cards.length} cards
      </p>
    </div>
    <div 
      data-list-id={list.id}
      bind:this={cardsEl}
      class="list__cards">
      {#each list.cards as card (card.id)}
        <Card 
          listId={list.id} 
          {card}
          on:editMode={disableSortable} />
      {/each}
    </div>
    <CreateCard 
      listId={list.id} 
      on:editMode={disableSortable} />
  </div>
</div>

<style lang="scss">
  .list {
    display: inline-block;
    font-size: 16px;
    white-space: normal;
    width: 290px;
    height: 100%;
    // border: 10px solid yellowgreen;
    // box-sizing: border-box;
    margin: 0 4px;    
    word-break: break-all;

    :global(&.sortable-ghost) {
      position: relative;
      opacity: .2;
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;        
        border-radius: 4px;
      }
    }

    :global(&.sortable-chosen) {
      cursor: move;
    }
    
    .list__inner {
      display: flex;
      flex-direction: column;
      max-height: 100%;
      padding: 10px 8px;
      box-sizing: border-box;
      background: #ebecf0;
      border-radius: 4px;
      
      .list__heading {        
        margin-bottom: 10px;
        p {
          color: #5e6c84;
          padding: 0 8px;
        }
      }
      .list__cards {
        overflow-x: hidden;
        overflow-y: auto;
      }      
    }
  }
</style>