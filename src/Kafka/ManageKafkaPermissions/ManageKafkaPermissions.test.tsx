import { composeStories } from "@storybook/testing-react";
import * as stories from "./ManageKafkaPermissions.stories";
import { userEvent } from "@storybook/testing-library";
import { render, waitForI18n, waitForPopper, within } from "../../test-utils";
const { InteractiveExample } = composeStories(stories);

describe("Manage Kafka Permissions Dialog", () => {
  jest.setTimeout(10000);
  it("should render an acl modal for a service account", async () => {
    const onCancel = jest.fn();
    const onSave = jest.fn();
    const onRemoveAcls = jest.fn();
    const comp = render(
      <InteractiveExample
        onCancel={onCancel}
        onSave={onSave}
        onRemoveAcls={onRemoveAcls}
      />
    );
    await waitForI18n(comp);
    userEvent.click(await comp.findByLabelText("Account"));
    await waitForPopper();

    expect(comp.getByText("All accounts")).toBeInTheDocument();
    expect(comp.getByText("Service accounts")).toBeInTheDocument();
    expect(comp.getByText("User accounts")).toBeInTheDocument();
    expect(comp.getByText("id2")).toBeInTheDocument();
    expect(comp.getByRole("button", { name: "Next" })).toBeDisabled();
    userEvent.click(await comp.findByText("id2"));
    expect(comp.getByRole("button", { name: "Next" })).toBeEnabled();
    userEvent.click(await comp.findByLabelText("Cancel"));
    expect(onCancel).toBeCalledTimes(1);
    userEvent.click(await comp.findByLabelText("Next"));
    expect(comp.getByText("Manage access")).toBeInTheDocument();
    expect(comp.getByText("id2")).toBeInTheDocument();
    expect(comp.getByText("Review existing permissions")).toBeInTheDocument();
    expect(comp.getByText("6")).toBeInTheDocument();
    expect(comp.getByText("Assign permissions")).toBeInTheDocument();
    expect(comp.getByRole("button", { name: "Save" })).toBeDisabled();
    userEvent.click(await comp.findByLabelText("Cancel"));
    expect(onCancel).toBeCalledTimes(2);
    userEvent.click(await comp.findByText("Review existing permissions"));
    const deleteBtn = comp.getAllByRole("button");
    expect(deleteBtn[0]).toBeInTheDocument();
    expect(deleteBtn[1]).toBeInTheDocument();
    expect(deleteBtn[2]).toBeInTheDocument();
    expect(deleteBtn[3]).toBeInTheDocument();

    //check  for all accounts rows
    const allAccountsRows = comp.getAllByText("All");
    expect(allAccountsRows[0]).toBeInTheDocument();
    expect(allAccountsRows[1]).toBeInTheDocument();
    //all accounts rows should not have delete button
    expect(
      within(allAccountsRows[0]).queryByRole("button")
    ).not.toBeInTheDocument();

    expect(
      within(allAccountsRows[1]).queryByRole("button")
    ).not.toBeInTheDocument();
    const deleteIcon = await comp.findAllByLabelText("Delete");
    userEvent.click(deleteIcon[0]);
    expect(onRemoveAcls).toBeCalledTimes(1);
    userEvent.click(comp.getByLabelText("Select"));
    await waitForPopper();
    userEvent.click(comp.getByRole("menuitem", { name: "Add permission" }));
    const resource = comp.getAllByText("Resource");
    const permission = comp.getAllByText("Permission");
    expect(resource[0]).toBeInTheDocument();
    expect(resource[1]).toBeInTheDocument();
    expect(permission[0]).toBeInTheDocument();
    expect(permission[1]).toBeInTheDocument();
    const selectOptions = comp.getAllByLabelText("Options menu");
    userEvent.click(selectOptions[0]);
    userEvent.click(comp.getByRole("option", { name: "Consumer group" }));
    userEvent.click(comp.getByLabelText("consumer-group name"));
    userEvent.type(await comp.findByPlaceholderText("Enter name"), "foo");
    await waitForPopper();
    userEvent.click(await comp.findByRole("option", { name: "foo" }));
    await waitForPopper();
    expect(await comp.findByDisplayValue("foo")).toBeInTheDocument();
    userEvent.click(comp.getByRole("button", { name: "Save" }));
    expect(onSave).not.toHaveBeenCalled();
    expect(comp.getByRole("button", { name: "Save" })).toBeDisabled();
    userEvent.type(await comp.findByPlaceholderText("Enter name"), "$");
    const option = await comp.findByText(
      "Valid characters in a consumer group ID include letters (Aa–Zz), numbers, underscores ( _ ), and hyphens ( - )."
    );
    expect(option).toBeInTheDocument();
    userEvent.click(comp.getByLabelText("Select"));
    await waitForPopper();
    userEvent.click(
      comp.getByRole("menuitem", {
        name: "Consume from a topic Provides access to consume from one or more topics depending on topic and consumer group selection criteria",
      })
    );
    userEvent.click(comp.getByLabelText("Select"));
    await waitForPopper();
    userEvent.click(
      comp.getByRole("menuitem", {
        name: "Manage access Provides access to add and remove permissions on this Kafka instance",
      })
    );
    userEvent.click(comp.getByLabelText("Select"));
    await waitForPopper();
    userEvent.click(
      comp.getByRole("menuitem", {
        name: "Produce to a topic Provides access to produce to one or more topics depending on topic selection criteria",
      })
    );
  });
  it("should render an acl modal for all accounts", async () => {
    const onCancel = jest.fn();
    const onSave = jest.fn();
    const onRemoveAcls = jest.fn();
    const comp = render(
      <InteractiveExample
        onCancel={onCancel}
        onSave={onSave}
        onRemoveAcls={onRemoveAcls}
      />
    );
    await waitForI18n(comp);
    userEvent.click(await comp.findByLabelText("Account"));
    await waitForPopper();

    expect(await comp.findByText("All accounts")).toBeInTheDocument();
    expect(await comp.findByText("Service accounts")).toBeInTheDocument();
    expect(await comp.findByText("User accounts")).toBeInTheDocument();
    expect(await comp.findByText("All accounts")).toBeInTheDocument();
    expect(await comp.findByRole("button", { name: "Next" })).toBeDisabled();
    //Select "All accounts"
    userEvent.click(await comp.findByText("All accounts"));
    userEvent.click(await comp.findByLabelText("Next"));

    const allAccounts = await comp.findAllByText("All accounts");
    expect(allAccounts[0]).toBeInTheDocument();
    expect(allAccounts[1]).toBeInTheDocument();
    expect(allAccounts[2]).toBeInTheDocument();
    expect(allAccounts[3]).toBeInTheDocument();
    expect(allAccounts[4]).toBeInTheDocument();
    expect(allAccounts[5]).toBeInTheDocument();
    expect(allAccounts[6]).toBeInTheDocument();
    expect(
      comp.getByText(
        "Review the list of existing permissions applied to all accounts within this Kafka instance."
      )
    ).toBeInTheDocument();
    expect(
      await comp.findByText("Assign permissions to all accounts")
    ).toBeInTheDocument();
    expect(comp.queryByText("All fields are required")).not.toBeInTheDocument();
    expect(await comp.findByText("Resource")).toBeInTheDocument();
    expect(await comp.findByText("Permission")).toBeInTheDocument();

    //Select assign manual permissions
    userEvent.click(await comp.findByLabelText("Select"));
    await waitForPopper();
    userEvent.click(
      await comp.findByRole("menuitem", { name: "Add permission" })
    );
    //Table header should be visible
    const resource = await comp.findAllByText("Resource");
    const permission = await comp.findAllByText("Permission");
    expect(resource[0]).toBeInTheDocument();
    expect(resource[1]).toBeInTheDocument();
    expect(permission[0]).toBeInTheDocument();
    expect(permission[1]).toBeInTheDocument();
    await waitForPopper();
    //Add consume from a topic permission
    userEvent.click(await comp.findByLabelText("Select"));
    await waitForPopper();
    userEvent.click(
      await comp.findByRole("menuitem", {
        name: "Consume from a topic Provides access to consume from one or more topics depending on topic and consumer group selection criteria",
      })
    );
    //Add multiple permissions to consume from a topic
    userEvent.click(await comp.findByLabelText("Select"));
    await waitForPopper();
    userEvent.click(
      await comp.findByRole("menuitem", {
        name: "Consume from a topic Provides access to consume from one or more topics depending on topic and consumer group selection criteria",
      })
    );

    //Add permissions for manage access
    userEvent.click(comp.getByLabelText("Select"));
    await waitForPopper();
    userEvent.click(
      await comp.findByRole("menuitem", {
        name: "Manage access Provides access to add and remove permissions on this Kafka instance",
      })
    );
    //Add multiple permissions for managing access
    userEvent.click(comp.getByLabelText("Select"));
    await waitForPopper();
    userEvent.click(
      await comp.findByRole("menuitem", {
        name: "Manage access Provides access to add and remove permissions on this Kafka instance",
      })
    );
    //Add permissions for producing a topic
    userEvent.click(await comp.findByLabelText("Select"));
    await waitForPopper();
    userEvent.click(
      await comp.findByRole("menuitem", {
        name: "Produce to a topic Provides access to produce to one or more topics depending on topic selection criteria",
      })
    );
    //Add multiple permissions for producing a topic
    userEvent.click(await comp.findByLabelText("Select"));
    await waitForPopper();
    userEvent.click(
      await comp.findByRole("menuitem", {
        name: "Produce to a topic Provides access to produce to one or more topics depending on topic selection criteria",
      })
    );
    userEvent.click(comp.getByRole("button", { name: "Save" }));
    expect(onSave).not.toHaveBeenCalled();
    //Delete permissions
    userEvent.click(comp.getByLabelText("manual-permission-delete"));
    const consumerTopic = comp.getAllByLabelText("consume-topic-delete");
    userEvent.click(consumerTopic[0]);
    userEvent.click(consumerTopic[1]);
    const produceTopic = comp.getAllByLabelText("produce-topic-delete");
    userEvent.click(produceTopic[0]);
    userEvent.click(produceTopic[1]);
    const manageAccess = comp.getAllByLabelText("manage-access-delete");
    userEvent.click(manageAccess[0]);
    userEvent.click(comp.getByRole("button", { name: "Save" }));
    expect(comp.getByText("All fields are required")).toBeInTheDocument();
  });
});
